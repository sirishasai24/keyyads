import { NextRequest, NextResponse } from "next/server";
import Property from "@/models/propertyModel";
import { connectDb } from "@/dbConfig/dbConfig";
import mongoose from 'mongoose';

connectDb();

export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const propertyId = url.pathname.split('/').pop();

        if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId as string)) {
            return NextResponse.json({ error: "Invalid Property ID" }, { status: 400 });
        }

        // Find the property and update its isApproved status to true
        const updatedProperty = await Property.findByIdAndUpdate(
            propertyId,
            { isApproved: true },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updatedProperty) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Property approved successfully",
            property: updatedProperty,
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("Error approving property:", error);
        let errorMessage = "Failed to approve property";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}