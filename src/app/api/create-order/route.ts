
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase Admin init error:', error.message);
  }
}
const db = admin.firestore();

const getCashfreeApiUrl = () =>
  process.env.NEXT_PUBLIC_CASHFREE_ENV === 'sandbox'
    ? 'https://sandbox.cashfree.com/pg'
    : 'https://api.cashfree.com/pg';

async function getCashfreeApiHeaders() {
  // --- LAST RESORT: HARDCODING SECRETS ---
  // This is not a security best practice, but it bypasses the failing
  // environment variable injection.
  // REPLACE these placeholder values with your actual keys.
  const appId = "YOUR_CASHFREE_APP_ID_HERE";
  const secretKey = "YOUR_CASHFREE_SECRET_KEY_HERE";
  // -----------------------------------------

  if (!appId || !secretKey || appId.includes("YOUR_")) {
    throw new Error('Cashfree credentials are not configured in the code. Please replace the placeholder values.');
  }

  return {
    'Content-Type': 'application/json',
    'x-api-version': '2023-08-01',
    'x-client-id': appId,
    'x-client-secret': secretKey,
  };
}

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      cartItems,
      cartTotal,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
    } = await req.json();

    if (!userId || !cartItems?.length || !cartTotal) {
      return NextResponse.json({ success: false, error: 'Missing order data.' }, { status: 400 });
    }

    let appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.shreevarma.org';
    appUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;

    const orderDocId = uuidv4();
    const pendingOrderRef = db.collection('pending_orders').doc(orderDocId);
    const userOrderRef = db.collection('users').doc(userId).collection('orders').doc(orderDocId);

    const orderData = {
      userId,
      orderStatus: 'pending',
      paymentStatus: 'PENDING',
      totalAmount: cartTotal,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      shippingAddress,
      items: cartItems,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      internalId: orderDocId,
    };

    // Store pending order details in both locations
    await Promise.all([
      pendingOrderRef.set(orderData),
      userOrderRef.set(orderData)
    ]);

    const returnUrl = `${appUrl}/order/success/${orderDocId}`;
    const notifyUrl = "https://cashfreewebhook-iklfboedvq-uc.a.run.app";

    const response = await fetch(`${getCashfreeApiUrl()}/orders`, {
      method: 'POST',
      headers: await getCashfreeApiHeaders(),
      body: JSON.stringify({
        order_id: orderDocId,
        order_amount: Number(cartTotal.toFixed(2)),
        order_currency: 'INR',
        customer_details: {
          customer_id: userId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: returnUrl,
          notify_url: notifyUrl,
        },
        order_note: 'SVW Online Store Purchase',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.payment_session_id) {
      console.error('Cashfree API Error:', data);
      await Promise.all([pendingOrderRef.delete(), userOrderRef.delete()]);
      return NextResponse.json({ success: false, error: data.message || 'Failed to contact payment gateway.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      payment_session_id: data.payment_session_id,
      orderDocId,
    });
  } catch (err: any) {
    console.error('[CREATE ORDER API ERROR]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
