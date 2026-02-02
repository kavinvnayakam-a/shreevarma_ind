import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

// --- ROBUST FIREBASE ADMIN INITIALIZATION ---
// This prevents the '5 NOT_FOUND' error by using explicit Service Account keys
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Critical: The replace() ensures the private key is formatted correctly in production
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
  }
}

const db = admin.firestore();

// Forces Production API if CASHFREE_ENV is set to 'production'
const getCashfreeApiUrl = () =>
  process.env.CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

async function getCashfreeApiHeaders() {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    throw new Error('Production Cashfree credentials (APP_ID/SECRET_KEY) are missing.');
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
    // This is where '5 NOT_FOUND' happens if Firebase Admin is misconfigured
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