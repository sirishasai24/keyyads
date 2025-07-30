import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, planName } = body;

        if (typeof amount !== 'number' || amount <= 0) {
            console.error("Invalid amount received for order creation:", amount);
            return NextResponse.json({ error: "Invalid amount provided" }, { status: 400 });
        }

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_${planName || 'subscription'}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json(
            { error: "Order creation failed", message: error || "Unknown error" },
            { status: 500 }
        );
    }
}