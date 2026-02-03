import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { Cashfree } from "cashfree-pg";
import { v4 as uuidv4 } from "uuid";
import { generateToken04 } from "./zegoServerAssistant";

if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Creates a Cashfree Order - Region set to Mumbai (asia-south1)
 */
export const createCashfreeOrder = onCall({ 
  region: "asia-south1",
  secrets: ["CASHFREE_CLIENT_ID", "CASHFREE_CLIENT_SECRET"] // Tells Firebase to load these
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required.");
  }

  // Configure Cashfree for Production
  Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID || "";
  Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET || "";
  Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION; // Switch to PRODUCTION

  const { cartTotal, customerPhone, customerName, customerEmail } = request.data;

  try {
    const orderId = `order_${uuidv4().substring(0, 8)}`;
    const cfRequest = {
      order_amount: parseFloat(cartTotal.toFixed(2)),
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: request.auth.uid,
        customer_phone: customerPhone,
        customer_name: customerName,
        customer_email: customerEmail
      },
      order_meta: {
        // PRODUCTION URLS
        return_url: `https://app.shreevarma.org/order/success/{order_id}`,
        notify_url: `https://app.shreevarma.org/api/webhooks/cashfree`
      }
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", cfRequest);
    
    return {
      success: true,
      payment_session_id: response.data.payment_session_id
    };
  } catch (err: any) {
    console.error("Cashfree Production Error:", err.response?.data || err.message);
    throw new HttpsError("internal", err.message || "Payment initialization failed");
  }
});

/**
 * Generates Zego Video Token - Region set to Mumbai
 */
export const getZegoToken = onCall({ 
  region: "asia-south1",
  secrets: ["ZEGO_SERVER_SECRET"] 
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required.");
  }

  const appID = parseInt(process.env.ZEGO_APP_ID || "0", 10);
  const secret = process.env.ZEGO_SERVER_SECRET || "";
  
  const token = generateToken04(appID, request.auth.uid, secret, 3600);
  
  return { token, appID };
});