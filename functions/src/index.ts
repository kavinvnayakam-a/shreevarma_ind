
/* eslint-disable */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import crypto from "crypto";
import { ZegoTokenBuilder } from "zego-server-assistant";


if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ZEGOCLOUD TOKEN GENERATION
export const getZegoToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { callId, userId } = data;

  if (typeof callId !== 'string' || !callId || typeof userId !== 'string' || !userId) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid "callId" and "userId" strings.');
  }

  const appIDStr = process.env.ZEGO_APP_ID;
  const serverSecret = process.env.ZEGO_SERVER_SECRET;

  if (!appIDStr) {
      console.error("CRITICAL: ZEGO_APP_ID is not set or accessible in the server environment variables.");
      throw new functions.https.HttpsError('internal', 'Video service is not configured correctly. [Error: Z-AID-MISSING]');
  }

  if (!serverSecret) {
      console.error("CRITICAL: ZEGO_SERVER_SECRET is not set or accessible in the server environment variables.");
      throw new functions.https.HttpsError('internal', 'Video service is not configured correctly. [Error: Z-SKEY-MISSING]');
  }

  const appID = parseInt(appIDStr, 10);
  
  if (isNaN(appID)) {
      console.error(`CRITICAL: ZEGO_APP_ID is not a valid number. Value: "${appIDStr}"`);
      throw new functions.https.HttpsError('internal', 'Video service configuration is invalid. [Error: Z-AID-INVALID]');
  }

  const effectiveTimeInSeconds = 3600; // Token expiration time, in seconds.
  const payload = ''; // No specific payload.

  try {
    const token = ZegoTokenBuilder.buildToken04(appID, serverSecret, callId, userId, effectiveTimeInSeconds, payload);
    
    // IMPORTANT: Return both the token and the App ID to the client
    return { token, appID };

  } catch (error: any) {
    console.error("FATAL: ZegoTokenBuilder.buildToken04 crashed:", error);
    const errorMessage = `Token generation failed on the server: ${error.message}`;
    throw new functions.https.HttpsError('internal', errorMessage);
  }
});


function verifyCashfreeSignature(
  signature: string,
  timestamp: string,
  body: string,
  secret: string
): boolean {
  try {
    const payload = `${timestamp}${body}`;
    const computed = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("base64");
    return computed === signature;
  } catch {
    return false;
  }
}

function generateOrderConfirmationEmail(orderData: any): string {
  const itemsHtml = orderData.items.map((item: any) => `
    <tr style="border-bottom: 1px solid #e0e0e0;">
      <td style="padding: 15px 0;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="80" valign="top">
              <img src="${item.imageUrls?.[0] || 'https://placehold.co/100'}" alt="${item.name}" width="80" style="border-radius: 8px;">
            </td>
            <td style="padding-left: 15px;">
              <p style="margin: 0; font-weight: bold; color: #333;">${item.name}</p>
              <p style="margin: 5px 0 0; color: #666;">Qty: ${item.quantity}</p>
            </td>
            <td align="right" style="font-weight: bold; color: #333;">
              ₹${Math.round(item.sellingPrice * item.quantity)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
        body { font-family: 'Montserrat', sans-serif; margin: 0; padding: 0; background-color: #f9f5f1; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0; }
        .header { background-color: #72392F; padding: 30px; text-align: center; }
        .header img { max-width: 180px; }
        .content { padding: 30px; }
        .footer { background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #888; }
        p { line-height: 1.6; }
        .button { display: inline-block; padding: 12px 25px; background-color: #72392F; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0249163472.firebasestorage.app/o/white-logo.png?alt=media&token=c2768564-99b3-42e7-9c4c-3543666b6964" alt="Shreevarma's Wellness">
        </div>
        <div class="content">
          <h1 style="color: #72392F; text-align: center; font-size: 24px;">Thank You for Your Order!</h1>
          <p style="text-align: center; color: #555;">Hi ${orderData.customer.name}, we've received your order and are getting it ready for shipment.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <h2 style="color: #333; font-size: 18px;">Order Summary</h2>
          <p style="color: #555;"><strong>Order ID:</strong> #${orderData.orderId}</p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            ${itemsHtml}
          </table>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px;">
            <tr>
              <td align="right" style="padding-bottom: 5px;">Subtotal:</td>
              <td align="right" style="padding-bottom: 5px;">₹${Math.round(orderData.totalAmount)}</td>
            </tr>
            <tr>
              <td align="right" style="padding-bottom: 5px;">Shipping:</td>
              <td align="right" style="padding-bottom: 5px; color: #28a745;">FREE</td>
            </tr>
            <tr style="font-weight: bold; font-size: 18px; color: #333;">
              <td align="right" style="padding-top: 10px; border-top: 2px solid #e0e0e0;">Total:</td>
              <td align="right" style="padding-top: 10px; border-top: 2px solid #e0e0e0;">₹${Math.round(orderData.totalAmount)}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <h2 style="color: #333; font-size: 18px;">Shipping To</h2>
          <p style="color: #555;">
            <strong>${orderData.shippingAddress.name}</strong><br>
            ${orderData.shippingAddress.address}<br>
            ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zip}
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://shreevarma.org/'}/profile/orders/${orderData.internalId}" class="button">View Order Details</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Shreevarma's Wellness. All Rights Reserved.</p>
          <p>If you have any questions, reply to this email or contact us at <a href="mailto:mainadmin@shreevarma.org">mainadmin@shreevarma.org</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}


export const cashfreeWebhook = functions.https.onRequest(
  async (req, res): Promise<void> => {
    try {
      const secretKey = process.env.CASHFREE_SECRET_KEY || "";
      const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      const signature = req.header("x-webhook-signature") || "";
      const timestamp = req.header("x-webhook-timestamp") || "";

      if (!verifyCashfreeSignature(signature, timestamp, rawBody, secretKey)) {
        console.warn("[WEBHOOK] Invalid signature.");
        res.status(200).json({ success: true, message: "Signature ignored, processed." });
        return;
      }

      const payload = typeof req.body === "object" ? req.body : JSON.parse(req.body);

      if (payload.type !== "PAYMENT_SUCCESS_WEBHOOK") {
        res.status(200).json({ success: true, message: "Not a payment success webhook." });
        return;
      }

      const orderUUID = payload.data.order.order_id;
      const userId = payload.data.customer_details.customer_id;
      const paymentData = payload.data.payment;

      let finalSvwId = ""; 

      const pendingRef = db.collection("pending_orders").doc(orderUUID);
      const counterRef = db.collection("counters").doc("orders");
      const finalUserOrderRef = db.collection("users").doc(userId).collection("orders").doc(orderUUID);

      await db.runTransaction(async (transaction) => {
        const pendingSnap = await transaction.get(pendingRef);
        const counterSnap = await transaction.get(counterRef);
        const existingOrderSnap = await transaction.get(finalUserOrderRef);

        if (existingOrderSnap.exists && existingOrderSnap.data()?.paymentStatus === "PAID") {
          console.log(`[WEBHOOK] Order ${orderUUID} has already been processed. Skipping.`);
          return;
        }
        
        if (!pendingSnap.exists) throw new Error(`Pending order ${orderUUID} not found.`);
        if (!counterSnap.exists) throw new Error("Counter document missing.");
        
        const pendingOrderData = pendingSnap.data();
        if (!pendingOrderData || !pendingOrderData.items) {
          throw new Error("Pending order data is invalid or missing items.");
        }

        // ---- Inventory Deduction Logic ----
        for (const item of pendingOrderData.items) {
            const productRef = db.collection('products').doc(item.productId);
            const productSnap = await transaction.get(productRef);

            if (!productSnap.exists) {
                console.warn(`Product with ID ${item.productId} not found. Skipping inventory update.`);
                continue;
            }

            const productData = productSnap.data();
            const currentStock = productData?.inventoryQuantity;

            if (typeof currentStock === 'number') {
                const newStock = currentStock - item.quantity;
                if (newStock < 0 && !productData?.continueSellingWhenOutOfStock) {
                    console.warn(`Not enough stock for product ${item.productId}. Order cannot be fulfilled as is.`);
                }
                transaction.update(productRef, { inventoryQuantity: newStock });
            }
        }
        // ---- End of Inventory Deduction ----

        const nextCount = (counterSnap.data()?.current || 1068) + 1;
        
        finalSvwId = `SVW-${nextCount}`;

        const finalData = {
          ...pendingOrderData,
          orderId: finalSvwId, 
          paymentStatus: "PAID",
          orderStatus: "Processing",
          paymentDetails: {
            cfOrderId: orderUUID,
            cfPaymentId: paymentData.cf_payment_id,
            paymentTime: paymentData.payment_time,
            paymentMethod: paymentData.payment_group,
            provider: "Cashfree",
          },
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        transaction.set(finalUserOrderRef, finalData);
        transaction.update(counterRef, { current: nextCount });
        transaction.delete(pendingRef);

      });

      if(finalSvwId) {
        console.log(`[WEBHOOK] Success! Order ${orderUUID} converted to ${finalSvwId}`);
      }
      
      res.status(200).json({ success: true });

    } catch (error: any) {
      console.error("[WEBHOOK] Fatal error:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);


export const sendOrderConfirmationEmail = functions.firestore
    .document('users/{userId}/orders/{orderId}')
    .onCreate(async (snap, context) => {
        const orderData = snap.data();

        if (!orderData || !orderData.customer || !orderData.customer.email) {
            console.log('Order data or customer email missing. Skipping email.');
            return null;
        }

        const emailHtml = generateOrderConfirmationEmail(orderData);

        try {
            await db.collection('mail').add({
                to: [orderData.customer.email],
                message: {
                    subject: `Order Confirmed: Your Shreevarma's Wellness Order #${orderData.orderId}`,
                    html: emailHtml,
                },
            });
            console.log(`Email trigger document created for order: ${orderData.orderId}`);
        } catch (error) {
            console.error('Error creating mail document:', error);
        }
        
        return null;
    });
