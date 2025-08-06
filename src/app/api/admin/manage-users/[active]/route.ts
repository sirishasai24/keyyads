import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import mongoose from 'mongoose';
connectDb();

export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();

        // Validate if the provided userId is a valid MongoDB ObjectId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        const reqBody = await request.json();
        const { isActive } = reqBody; // Expecting { isActive: boolean } in the request body

        // Find the user by ID and update their isActive status
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isActive }, // Update only the isActive field
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "User status updated successfully",
            user: updatedUser,
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error updating user status:", error);
        return NextResponse.json({ error: "Failed to update user status", details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();

        // Validate if the provided userId is a valid MongoDB ObjectId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "User deleted successfully",
            user: deletedUser,
        }, { status: 200 });
    }
    catch(error){
        return NextResponse.json({ error: "Failed to delete user", details: error }, { status: 500 });
    }
}