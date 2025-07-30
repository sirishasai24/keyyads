import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import User from "@/models/userModel";
import Plan from "@/models/planModel"; // Renamed from UserPlanDetails to Plan as per your model
import { connectDb } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken"; // Assuming this path for your helper

const PLAN_DURATIONS_MONTHS: { [key: string]: number } = {
    "Quarterly Plan": 3,
    "Half Yearly Plan": 6,
    "Annual Plan": 12,
};

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const userId = await getDataFromToken(req);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            plan,
        } = body;
         const currentUserPlanDetails = await Plan.findOne({ userId: userId });

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !plan || !currentUserPlanDetails) {
            return NextResponse.json({ success: false, message: "Missing payment or plan details" }, { status: 400 });
        }

        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!razorpayKeySecret) {
            console.error("RAZORPAY_KEY_SECRET is not set in environment variables.");
            return NextResponse.json({ success: false, message: "Server configuration error." }, { status: 500 });
        }

        const isPaymentValid = verifyRazorpayPaymentSignature({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            key_secret: razorpayKeySecret,
        });

        if (!isPaymentValid) {
            console.warn("Razorpay signature verification failed for order:", razorpay_order_id);
            return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
        }

        const existingPlanDetails = await Plan.findOne({ userId: user._id, planTitle: currentUserPlanDetails.planTitle });

        if (!existingPlanDetails) {
            console.error(`Attempted to renew plan for user ${user._id} but no matching existing plan details found for title: ${currentUserPlanDetails.planTitle}`);
            return NextResponse.json({ success: false, message: "No active plan found to renew." }, { status: 404 });
        }

        const planDurationMonths = PLAN_DURATIONS_MONTHS[plan.title];
        if (typeof planDurationMonths === 'undefined') {
            return NextResponse.json({ success: false, message: "Invalid plan title provided for renewal." }, { status: 400 });
        }

        let currentExpiryDate = new Date(existingPlanDetails.expiryDate);
        const now = new Date();

        if (currentExpiryDate < now) {
            currentExpiryDate = now;
            console.log(`Current plan for user ${user._id} expired. Renewing from current date.`);
        }

        const newExpiryDate = new Date(currentExpiryDate);
        newExpiryDate.setMonth(newExpiryDate.getMonth() + planDurationMonths);

        existingPlanDetails.expiryDate = newExpiryDate.toISOString();
        existingPlanDetails.pricePaid = plan.price;
        existingPlanDetails.transactionId = razorpay_payment_id;
        existingPlanDetails.planDetailsSnapshot = plan;

        existingPlanDetails.listings = plan.listings;
        existingPlanDetails.premiumBadging = plan.premiumBadging;
        existingPlanDetails.shows = plan.shows;
        existingPlanDetails.emi = plan.emi;
        existingPlanDetails.saleAssurance = plan.saleAssurance;
        existingPlanDetails.socialMedia = plan.socialMedia;
        existingPlanDetails.moneyBack = plan.moneyBack;
        existingPlanDetails.teleCalling = plan.teleCalling;
        existingPlanDetails.originalPrice = plan.originalPrice;
        existingPlanDetails.note = plan.note;
        existingPlanDetails.createdAt = new Date().toISOString();

        await existingPlanDetails.save();

        user.planId = existingPlanDetails._id; // Update planId to refer to the renewed plan document
        await user.save();

        console.log(`Plan '${plan.title}' renewed for user ${user._id}. New expiry: ${newExpiryDate.toISOString()}`);

        return NextResponse.json({
            success: true,
            message: "Plan successfully renewed!",
            newExpiryDate: newExpiryDate.toISOString(),
            planDetails: existingPlanDetails,
        });

    } catch (error: any) {
        console.error("Error during plan renewal:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error during plan renewal", error: error.message },
            { status: 500 }
        );
    }
}