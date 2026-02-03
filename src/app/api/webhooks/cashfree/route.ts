import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Initialize Admin SDK for production
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const data = JSON.parse(rawBody);

    // Cashfree sends order info inside data.data.order
    const { order_id, order_status } = data.data.order;
    const { customer_id } = data.data.customer_details;

    if (order_status === "PAID") {
      // Path matches your frontend listener: users/{uid}/orders/{orderId}
      const orderRef = db.collection("users").doc(customer_id).collection("orders").doc(order_id);
      
      await orderRef.set({
        paymentStatus: "PAID",
        status: "confirmed",
        paymentDetails: data.data.payment,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        // Trigger Email Data for Firebase Extension
        to: data.data.customer_details.customer_email,
        message: {
          subject: `Order Confirmed: ${order_id}`,
          html: `<h1>Thank you for your order!</h1><p>Your order ${order_id} has been confirmed.</p>`,
        }
      }, { merge: true });

      console.log(`✅ Production Order ${order_id} updated to PAID`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}