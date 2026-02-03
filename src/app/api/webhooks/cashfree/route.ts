import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Ensure Admin SDK is initialized with Service Account
// We use the FB_ prefix here to match your apphosting.yaml mappings
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID, // Mapped from NEXT_PUBLIC_FIREBASE_PROJECT_ID
      clientEmail: process.env.FB_CLIENT_EMAIL,     // Mapped from secret FB_CLIENT_EMAIL
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Mapped from secret FB_PRIVATE_KEY
    }),
  });
}

const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Cashfree 2023-08-01 API structure: data.data.order
    const { order_id, order_status, order_amount } = data.data.order;
    const { customer_id, customer_phone, customer_email } = data.data.customer_details;

    // We only process if the status is exactly "PAID"
    if (order_status === "PAID") {
      // Path: users/{uid}/orders/{orderId}
      const orderRef = db.collection("users").doc(customer_id).collection("orders").doc(order_id);
      
      await orderRef.set({
        orderId: order_id,
        amount: order_amount,
        customerPhone: customer_phone,
        customerEmail: customer_email,
        paymentStatus: "PAID", // This is the specific trigger for your SuccessClient flip
        status: "confirmed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      console.log(`✅ Order ${order_id} verified and created for user ${customer_id}`);
    }

    // Always return 200 to Cashfree so they don't keep retrying
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook Processing Error:", err.message);
    // Return 400 only if the JSON is malformed or initialization fails
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}