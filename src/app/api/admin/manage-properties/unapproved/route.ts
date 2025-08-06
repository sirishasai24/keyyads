import { NextRequest, NextResponse } from "next/server";
import Property from "@/models/propertyModel";
import { connectDb } from "@/dbConfig/dbConfig";
import mongoose from 'mongoose';

connectDb();

export async function GET(request: NextRequest) {
    try {
        

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const search = searchParams.get('search') || '';
        const skip = (page - 1) * limit;

        const filter: mongoose.FilterQuery<typeof Property> = { isApproved: false };

        // Apply search query
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            const orConditions: mongoose.FilterQuery<typeof Property>[] = [
                { title: searchRegex },
                { address: searchRegex },
                { 'location.city': searchRegex },
                { description: searchRegex }
            ];
            // If the search term is a valid ObjectId, add it to the search criteria
            if (mongoose.Types.ObjectId.isValid(search)) {
                orConditions.push({ _id: search });
            }
            filter.$or = orConditions;
        }

        const properties = await Property.find(filter)
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 }); // Sort by newest first

        const totalProperties = await Property.countDocuments(filter);
        const totalPages = Math.ceil(totalProperties / limit);

        return NextResponse.json({
            properties,
            totalPages,
            currentPage: page,
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("Error fetching unapproved properties:", error);
        let errorMessage = "Failed to fetch unapproved properties";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}