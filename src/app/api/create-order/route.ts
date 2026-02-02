
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { firebaseConfig } from '@/firebase/config';

// --- Standard Firebase Admin Initialization ---
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase Admin init error:', error.message);
  }
}

const db = admin.firestore();

async function getSecrets(): Promise<{ appId: string; secretKey: string }> {
  const client = new SecretManagerServiceClient();
  let projectId: string | undefined | null;

  try {
    // Attempt to get project ID automatically from the client's authenticated context.
    [projectId] = await client.getProjectId();
  } catch (e: any) {
    console.error("Could not automatically determine Project ID.", e.message);
    // Fallback to the config if auto-detection fails.
    projectId = firebaseConfig.projectId;
  }
  
  if (!projectId) {
    throw new Error('FATAL: Firebase project ID is not configured and could not be auto-detected. Cannot fetch secrets.');
  }

  const appIdSecretName = `projects/${projectId}/secrets/CASHFREE_APP_ID/versions/latest`;
  const secretKeySecretName = `projects/${projectId}/secrets/CASHFREE_SECRET_KEY/versions/latest`;

  try {
    const [appIdVersion] = await client.accessSecretVersion({ name: appIdSecretName });
    const [secretKeyVersion] = await client.accessSecretVersion({ name: secretKeySecretName });

    const appId = appIdVersion.payload?.data?.toString();
    const secretKey = secretKeyVersion.payload?.data?.toString();

    if (!appId || !secretKey) {
      throw new Error('One or more secrets were fetched but found to be empty. Please check the values in Secret Manager.');
    }

    return { appId, secretKey };
  } catch (error: any) {
      console.error("Full Secret Manager Access Error:", error);
      
      const detailedError = `Configuration Error: The server could not access payment secrets from Google Secret Manager. This is an infrastructure issue.
      
      Project ID Used: '${projectId}'
      Secret Path 1: '${appIdSecretName}'
      Secret Path 2: '${secretKeySecretName}'

      Please verify the following in your Google Cloud project:
      1. The 'Secret Manager API' is enabled.
      2. The secrets 'CASHFREE_APP_ID' and 'CASHFREE_SECRET_KEY' exist in the project '${projectId}'.
      3. The App Hosting service account (ending in '@gcp-sa-apphosting.iam.gserviceaccount.com') has the 'Secret Manager Secret Accessor' IAM role.`;
      
      throw new Error(detailedError);
  }
}


const getCashfreeApiUrl = () =>
  process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

async function getCashfreeApiHeaders() {
  const { appId, secretKey } = await getSecrets();

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
