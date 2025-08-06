import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import mongoose from 'mongoose';

// Connect to the database once
connectDb();

// GET route to fetch a single user by ID
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();

        // Validate if the provided userId is a valid MongoDB ObjectId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user", details: error.message }, { status: 500 });
    }
}

// PUT route to update an existing user by ID
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();

        // Validate if the provided userId is a valid MongoDB ObjectId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        const reqBody = await request.json();

        // Include all editable fields
        const { username, email, role, plan, phone, isVerified, isActive, listings, premiumBadging, shows } = reqBody;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, role, plan, phone, isVerified, isActive, listings, premiumBadging, shows },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "User updated successfully",
            user: updatedUser,
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user", details: error.message }, { status: 500 });
    }
}