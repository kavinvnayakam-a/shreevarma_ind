// app/api/create-order/route.ts
import { NextResponse } from "next/server";
import { Cashfree } from "cashfree-pg";

Cashfree.XClientId = process.env.CASHFREE_APP_ID!;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

export async function POST(request: Request) {
  try {
    const { amount, customerId, customerPhone } = await request.json();

    const orderRequest = {
      order_amount: amount,
      order_currency: "INR",
      order_id: `order_${Date.now()}`, // Unique order ID
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
        customer_email: "test@example.com",
      },
      order_meta: {
        // For Modal, you can use a placeholder; the SDK handles the popup
        return_url: "https://yourdomain.com/payment-status?order_id={order_id}",
      },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);
    
    // We need the payment_session_id to open the modal
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}