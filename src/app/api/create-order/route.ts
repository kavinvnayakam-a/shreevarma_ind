import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

// --- Standard Firebase Admin Initialization ---
if (!admin.apps.length) {
  try {
    // This uses Application Default Credentials automatically in App Hosting
    admin.initializeApp();
  } catch (error: any) {
    // Log error but don't crash if it's already initialized
    console.error('Firebase Admin init error:', error.message);
  }
}

const db = admin.firestore();

const getCashfreeApiUrl = () =>
  process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

async function getCashfreeApiHeaders() {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  // --- Start of my diagnostic block from last turn ---
  console.log('--- [DIAGNOSTIC] Cashfree Runtime Secret Check ---');
  if (appId) {
    console.log('[DIAGNOSTIC] CASHFREE_APP_ID: FOUND (length: ' + appId.length + ')');
  } else {
    console.log('[DIAGNOSTIC] CASHFREE_APP_ID: MISSING');
  }

  if (secretKey) {
    console.log('[DIAGNOSTIC] CASHFREE_SECRET_KEY: FOUND (length: ' + secretKey.length + ')');
  } else {
    console.log('[DIAGNOSTIC] CASHFREE_SECRET_KEY: MISSING');
  }
  // --- End of diagnostic block ---
  
  const missing = [];
  if (!appId) missing.push('CASHFREE_APP_ID');
  if (!secretKey) missing.push('CASHFREE_SECRET_KEY');

  if (missing.length > 0) {
    // This is a critical diagnostic log.
    console.error('[DIAGNOSTIC] One or more secrets are missing. This is a configuration issue between Secret Manager and App Hosting.');
    console.log('[DIAGNOSTIC] All available environment keys:', Object.keys(process.env).join(', '));

    const specificErrorMessage = `Configuration Error: The server could not access payment secrets (${missing.join(', ')}). In your Google Cloud project, find the IAM Principal ending in '@gcp-sa-apphosting.iam.gserviceaccount.com' and ensure it has the 'Secret Manager Secret Accessor' role for the required secrets.`;
    throw new Error(specificErrorMessage);
  }

  return {
    'Content-Type': 'application/json',
    'x-api-version': '2023-08-01',
    'x-client-id': appId,
    'x-client-secret': secretKey,
  };
}

export async function POST(req: NextRequest) {
  const orderDocId = uuidv4();
  
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
    
    if (!userId || !cartItems?.length || !cartTotal) {
      return NextResponse.json({ success: false, error: 'Incomplete order data.' }, { status: 400 });
    }

    const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);
    let appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.shreevarma.org';
    appUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;

    const pendingOrderRef = db.collection('pending_orders').doc(orderDocId);
    const userOrderRef = db.collection('users').doc(userId).collection('orders').doc(orderDocId);

    const orderData = {
      userId,
      orderStatus: 'pending',
      paymentStatus: 'PENDING',
      totalAmount: cartTotal,
      customer: { name: customerName, email: customerEmail, phone: cleanPhone },
      shippingAddress,
      items: cartItems,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      internalId: orderDocId,
    };

    await Promise.all([
      pendingOrderRef.set(orderData),
      userOrderRef.set(orderData)
    ]);

    const headers = await getCashfreeApiHeaders();
    const response = await fetch(`${getCashfreeApiUrl()}/orders`, {
      method: 'POST',
      headers,
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
          return_url: `${appUrl}/order/success/${orderDocId}?order_id={order_id}`,
          notify_url: "https://cashfreewebhook-iklfboedvq-uc.a.run.app",
        },
        order_note: 'Ayurvedic Products Purchase',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.payment_session_id) {
      console.error('Cashfree API Error Response:', data);
      await Promise.all([pendingOrderRef.delete(), userOrderRef.delete()]);
      return NextResponse.json({ success: false, error: data.message || 'Payment gateway rejection.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      payment_session_id: data.payment_session_id,
      orderDocId,
    });

  } catch (err: any) {
    console.error('[SERVER_ORDER_ERROR_CRITICAL]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
