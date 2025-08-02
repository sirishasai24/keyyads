import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import Plan from "@/models/planModel";
import User from "@/models/userModel";
import crypto from "crypto";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDb();

const plans = [
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
    price: "₹8,999/-",
    originalPrice: "₹17,998",
    note: "Inclusive of GST",
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
    price: "₹17,999/-",
    originalPrice: "₹35,998",
    note: "Inclusive of GST",
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
    price: "₹29,988/-",
    originalPrice: "₹59,976",
    note: "Inclusive of GST",
  },
];

export async function POST(request: NextRequest) {
  const userId = await getDataFromToken(request);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized access." }, { status: 401 });
  }

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      plan: purchasedPlanDetails,
    } = await request.json();

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ message: "Transaction not legit!" }, { status: 400 });
    }

    const selectedPlan = plans.find(p => p.title === purchasedPlanDetails.title);
    if (!selectedPlan) {
      return NextResponse.json({ message: "Invalid plan selected." }, { status: 400 });
    }

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    if (selectedPlan.title === "Quarterly Plan") expiryDate.setMonth(expiryDate.getMonth() + 3);
    else if (selectedPlan.title === "Half Yearly Plan") expiryDate.setMonth(expiryDate.getMonth() + 6);
    else if (selectedPlan.title === "Annual Plan") expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const existingPlan = await Plan.findOne({ transactionId: razorpay_payment_id });
    if (existingPlan) {
      return NextResponse.json(
        { message: "This transaction has already been processed.", success: false, plan: existingPlan },
        { status: 409 }
      );
    }

    const newPlan = new Plan({
      userId,
      planTitle: selectedPlan.title,
      startDate,
      expiryDate,
      transactionId: razorpay_payment_id,
      listings: selectedPlan.listings,
      premiumBadging: selectedPlan.premiumBadging,
      shows: selectedPlan.shows,
      emi: selectedPlan.emi,
      saleAssurance: selectedPlan.saleAssurance,
      socialMedia: selectedPlan.socialMedia,
      moneyBack: selectedPlan.moneyBack,
      teleCalling: selectedPlan.teleCalling,
      pricePaid: selectedPlan.price,
      originalPrice: selectedPlan.originalPrice,
      note: selectedPlan.note,
      planDetailsSnapshot: selectedPlan,
    });

    const savedPlan = await newPlan.save();

    // 🔄 Update user with plan info
    await User.findByIdAndUpdate(userId, {
      plan: selectedPlan.title,
      listings: selectedPlan.listings,
      premiumBadging: selectedPlan.premiumBadging,
      planId: savedPlan._id,
      shows: selectedPlan.shows
    });

    return NextResponse.json({
      message: "Payment successful and plan saved!",
      success: true,
      plan: savedPlan,
    });

  } catch (error) {
    return NextResponse.json({ error: error || "Failed to save plan." }, { status: 500 });
  }
}
