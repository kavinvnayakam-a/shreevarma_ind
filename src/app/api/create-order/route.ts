
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { Cashfree } from 'cashfree-pg';

// --- Standard Firebase Admin Initialization ---
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase Admin init error:', error.message);
  }
}

const db = admin.firestore();

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
    
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
        throw new Error("Cashfree credentials are not configured in the environment. Please check your .env.local file or deployment variables.");
    }


    // --- Modern Cashfree SDK v4 Initialization ---
    const cashfree = new Cashfree({
        env: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ? 'PRODUCTION' : 'SANDBOX',
        appId: appId,
        secretKey: secretKey,
    });

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

    // Store pending order details in Firestore
    await Promise.all([
      pendingOrderRef.set(orderData),
      userOrderRef.set(orderData)
    ]);
    
    const request = {
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
          return_url: `${appUrl}/order/success/{order_id}`,
          notify_url: "https://cashfreewebhook-iklfboedvq-uc.a.run.app", // Keep your existing webhook
        },
        order_note: 'Shreevarma Wellness Order',
    };

    const response = await cashfree.orders.create(request);
    const orderResponseData = response.data;

    if (!orderResponseData.payment_session_id) {
       console.error('Cashfree SDK Error:', response);
       await Promise.all([pendingOrderRef.delete(), userOrderRef.delete()]);
       return NextResponse.json({ success: false, error: 'Payment gateway rejection.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      payment_session_id: orderResponseData.payment_session_id,
      orderDocId,
    });

  } catch (err: any) {
    console.error('[SERVER_ORDER_ERROR_CRITICAL]', err);
    const errorMessage = err.response?.data?.message || err.message || 'Internal Server Error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
