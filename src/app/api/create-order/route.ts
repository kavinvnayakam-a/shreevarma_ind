
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

// --- Standard Firebase Admin Initialization ---
// This safely initializes the Admin SDK using Application Default Credentials,
// which are automatically available in the App Hosting environment.
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Forces Production API if CASHFREE_ENV is set to 'production'
const getCashfreeApiUrl = () =>
  process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

async function getCashfreeApiHeaders() {
  // Try to get the app ID from either the runtime-only or public variable for resilience.
  const appId = process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  // Improved error checking to provide more specific feedback.
  if (!appId || !secretKey) {
    const missing = [];
    if (!appId) missing.push('CASHFREE_APP_ID');
    if (!secretKey) missing.push('CASHFREE_SECRET_KEY');
    console.error(`Missing Cashfree secrets at runtime: ${missing.join(', ')}`);
    throw new Error(`Server configuration error: Required payment secrets (${missing.join(', ')}) are missing. Please verify your Secret Manager setup.`);
  }

  return {
    'Content-Type': 'application/json',
    'x-api-version': '2023-08-01',
    'x-client-id': appId,
    'x-client-secret': secretKey,
  };
}

export async function POST(req: NextRequest) {
  // Generate ID early so we can clean up if Cashfree fails
  const orderDocId = uuidv4();
  const pendingOrderRef = db.collection('pending_orders').doc(orderDocId);

  try {
    const body = await req.json();
    const {
      userId,
      cartItems,
      cartTotal,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
    } = body;

    // Validation
    if (!userId || !cartItems?.length || !cartTotal) {
      return NextResponse.json({ success: false, error: 'Incomplete order data.' }, { status: 400 });
    }

    // Cashfree Production requires a clean 10-digit phone number
    const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);

    let appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shreevarma.org';
    appUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;

    // 1. SAVE TO FIRESTORE 
    await pendingOrderRef.set({
      userId,
      orderStatus: 'pending',
      paymentStatus: 'PENDING',
      totalAmount: cartTotal,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: cleanPhone,
      },
      shippingAddress,
      items: cartItems,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      internalId: orderDocId,
    });

    const returnUrl = `${appUrl}/order/success/${orderDocId}?order_id={order_id}`;
    const notifyUrl = "https://cashfreewebhook-iklfboedvq-uc.a.run.app";

    // 2. INITIATE CASHFREE ORDER
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
          customer_phone: cleanPhone,
        },
        order_meta: {
          return_url: returnUrl,
          notify_url: notifyUrl,
        },
        order_note: 'Ayurvedic Products Purchase',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.payment_session_id) {
      console.error('Cashfree API Error:', data);
      // Delete the pending order if the gateway fails
      await pendingOrderRef.delete();
      return NextResponse.json({ 
        success: false, 
        error: data.message || 'Payment gateway rejection.' 
      }, { status: 500 });
    }

    // 3. RETURN SESSION TO CLIENT
    return NextResponse.json({
      success: true,
      payment_session_id: data.payment_session_id,
      orderDocId,
    });

  } catch (err: any) {
    console.error('[SERVER_ORDER_ERROR]', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
