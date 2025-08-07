import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import User from "@/models/userModel";
import Plan from "@/models/planModel";
import { connectDb } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";

const backendPlans = [
    {
        title: "Quarterly Plan",
        listings: 5,
        premiumBadging: 1,
        shows: 1,
        emi: true,
        saleAssurance: false,
        socialMedia: true,
        moneyBack: false,
        teleCalling: false,
        price: 8999,
        originalPrice: 17998,
        note: "Inclusive of GST",
        order: 1,
    },
    {
        title: "Half Yearly Plan",
        listings: 10,
        premiumBadging: 2,
        shows: 2,
        emi: true,
        saleAssurance: false,
        socialMedia: true,
        moneyBack: false,
        teleCalling: true,
        price: 17999,
        originalPrice: 35998,
        note: "Inclusive of GST",
        order: 2,
    },
    {
        title: "Annual Plan",
        listings: 25,
        premiumBadging: 3,
        shows: 4,
        emi: true,
        saleAssurance: true,
        socialMedia: true,
        moneyBack: "Yes (After 6th month)",
        teleCalling: true,
        price: 29988,
        originalPrice: 59976,
        note: "Inclusive of GST",
        order: 3,
    },
];

const PLAN_DURATIONS_MONTHS: { [key: string]: number } = {
    "Quarterly Plan": 3,
    "Half Yearly Plan": 6,
    "Annual Plan": 12,
};


export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const userId = await getDataFromToken(req);
        if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            plan,
        } = await req.json();

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !plan) {
            return NextResponse.json({ success: false, message: "Missing payment or plan details" }, { status: 400 });
        }

        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!razorpayKeySecret) {
            return NextResponse.json({ success: false, message: "Server config error" }, { status: 500 });
        }

        const isPaymentValid = verifyRazorpayPaymentSignature({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            key_secret: razorpayKeySecret,
        });

        if (!isPaymentValid) {
            return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 });
        }

        const user = await User.findById(userId);
        const existingPlan = await Plan.findById(user?.planId);
        if (!user || !existingPlan) {
            return NextResponse.json({ success: false, message: "User or active plan not found" }, { status: 404 });
        }

        const newPlanDetails = backendPlans.find(p => p.title === plan.title);
        if (!newPlanDetails) {
            return NextResponse.json({ success: false, message: "Invalid new plan selected" }, { status: 400 });
        }

        const existingTransaction = await Plan.findOne({ transactionId: razorpay_payment_id });
        if (existingTransaction) {
            return NextResponse.json({ success: false, message: "Duplicate transaction" }, { status: 409 });
        }

        const newPlanPrice = newPlanDetails.price;
        const newStartDate = new Date();
        const newExpiryDate = new Date(newStartDate);
        newExpiryDate.setMonth(newExpiryDate.getMonth() + PLAN_DURATIONS_MONTHS[newPlanDetails.title]);

        user.plan = newPlanDetails.title;
        user.listings += (newPlanDetails.listings ?? 0) - (existingPlan.listings ?? 0);
        user.premiumBadging += (newPlanDetails.premiumBadging ?? 0) - (existingPlan.premiumBadging ?? 0);
        user.shows += (newPlanDetails.shows ?? 0) - (existingPlan.shows ?? 0);
        await user.save();

        Object.assign(existingPlan, {
            userId,
            planTitle: newPlanDetails.title,
            startDate: newStartDate,
            expiryDate: newExpiryDate,
            transactionId: razorpay_payment_id,
            listings: newPlanDetails.listings,
            premiumBadging: newPlanDetails.premiumBadging,
            shows: newPlanDetails.shows,
            emi: newPlanDetails.emi,
            saleAssurance: newPlanDetails.saleAssurance,
            socialMedia: newPlanDetails.socialMedia,
            moneyBack: newPlanDetails.moneyBack,
            teleCalling: newPlanDetails.teleCalling,
            pricePaid: newPlanPrice,
            originalPrice: newPlanDetails.originalPrice,
            note: newPlanDetails.note,
            planDetailsSnapshot: newPlanDetails,
            createdAt: new Date(),
        });

        const savedPlan = await existingPlan.save();

        return NextResponse.json({
            success: true,
            message: "Plan successfully upgraded!",
            newExpiryDate: savedPlan.expiryDate.toISOString(),
            planDetails: savedPlan,
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error during plan upgrade", error: error },
            { status: 500 }
        );
    }
}
