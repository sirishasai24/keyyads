// src/app/api/user/update-phone/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel"; // Import your User model
import { getDataFromToken } from "@/helpers/getDataFromToken"; // Assuming this helper exists

connectDb();

export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const reqBody = await request.json();
        const { phone } = reqBody;

        if (!phone) {
            return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
        }

        // Basic phone number validation (can be enhanced with regex for specific formats)
        if (String(phone).length < 10 || String(phone).length > 15 || !/^\d+$/.test(phone)) {
            return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
        }

        // Check if phone number already exists for another user
        const existingUserWithPhone = await User.findOne({ phone: phone, _id: { $ne: userId } });
        if (existingUserWithPhone) {
            return NextResponse.json({ error: "This phone number is already registered." }, { status: 400 });
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        // Update phone number and mark it as unverified
        user.phone = phone;
        user.phoneVerified = false; // Important: When phone changes, it should become unverified.
        await user.save();

        // Return updated user data (or a subset)
        const updatedUser = {
            username: user.username,
            email: user.email,
            phone: user.phone,
            phoneVerified: user.phoneVerified,
            profileImageURL: user.profileImageURL,
            role: user.role,
            createdAt: user.createdAt,
            plan: user.plan,
            listings: user.listings,
            premiumBadging: user.premiumBadging,
            shows: user.shows,
        };

        return NextResponse.json({
            message: "Phone number updated successfully.",
            user: updatedUser,
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error updating phone number:", error);
        return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
    }
}