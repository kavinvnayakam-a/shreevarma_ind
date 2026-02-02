
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
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

// --- Hardcoded Project ID to fix environment detection issue ---
const GCP_PROJECT_ID = 'shreevarma-india-location';

async function getSecrets(): Promise<{ appId: string; secretKey: string }> {
  const client = new SecretManagerServiceClient();
  
  if (!GCP_PROJECT_ID) {
    throw new Error('FATAL: Google Cloud Project ID is not configured.');
  }

  const appIdSecretName = `projects/${GCP_PROJECT_ID}/secrets/CASHFREE_APP_ID/versions/latest`;
  const secretKeySecretName = `projects/${GCP_PROJECT_ID}/secrets/CASHFREE_SECRET_KEY/versions/latest`;

  try {
    const [appIdVersion] = await client.accessSecretVersion({ name: appIdSecretName });
    const [secretKeyVersion] = await client.accessSecretVersion({ name: secretKeySecretName });

    const appId = appIdVersion.payload?.data?.toString();
    const secretKey = secretKeyVersion.payload?.data?.toString();

    if (!appId || !secretKey) {
      throw new Error('One or more Cashfree secrets were fetched but found to be empty.');
    }

    return { appId, secretKey };
  } catch (error: any) {
      const detailedError = `Configuration Error: The server could not access payment secrets from Google Secret Manager. This is an infrastructure issue.
      
      Project ID Used: '${GCP_PROJECT_ID}'
      Secret Path 1: '${appIdSecretName}'
      Secret Path 2: '${secretKeySecretName}'

      Please verify the following in your Google Cloud project:
      1. The 'Secret Manager API' is enabled.
      2. The secrets 'CASHFREE_APP_ID' and 'CASHFREE_SECRET_KEY' exist in the project '${GCP_PROJECT_ID}'.
      3. The App Hosting service account (ending in '@gcp-sa-apphosting.iam.gserviceaccount.com') has the 'Secret Manager Secret Accessor' IAM role.`;
      
      throw new Error(detailedError);
  }
}

// Configure Cashfree SDK
Cashfree.XEnvironment = process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' 
    ? Cashfree.Environment.PRODUCTION 
    : Cashfree.Environment.SANDBOX;

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

    // Set credentials for the SDK
    const secrets = await getSecrets();
    Cashfree.XClientId = secrets.appId;
    Cashfree.XClientSecret = secrets.secretKey;

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

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    const orderResponseData = response.data;

    if (!orderResponseData.payment_session_id) {
       console.error('Cashfree SDK Error:', response);
       await Promise.all([pendingRef.delete(), userOrderRef.delete()]);
       return NextResponse.json({ success: false, error: 'Payment gateway rejection.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      payment_session_id: orderResponseData.payment_session_id,
      orderDocId,
    });

  } catch (err: any) {
    console.error('[SERVER_ORDER_ERROR_CRITICAL]', err);
    // The error from getSecrets() is now more descriptive
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
