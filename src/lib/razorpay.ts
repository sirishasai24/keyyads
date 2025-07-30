import crypto from 'crypto';

interface PaymentVerificationParams {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    key_secret: string;
}

export function verifyRazorpayPaymentSignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    key_secret,
}: PaymentVerificationParams): boolean {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(body)
        .digest("hex");

    return expectedSignature === razorpay_signature;
}