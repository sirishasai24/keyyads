import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import mongoose from 'mongoose'; // Import mongoose to use ObjectId validation and types

// Connect to the database once (ensure this is called somewhere, e.g., in a global setup or per-route)
// connectDb(); // Removed this here as it's better to ensure it's called once globally or within each route handler.
// Assuming connectDb() is called appropriately elsewhere or within each handler.
// If it's not called globally, uncomment connectDb() inside each function.

export async function GET(request: NextRequest) {
    try {
        await connectDb(); // Ensure DB connection is established for this request

        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        // Build the filter dynamically to avoid the CastError
        // Use mongoose.FilterQuery<typeof User> for type safety
        const orClauses: mongoose.FilterQuery<typeof User>[] = [];

        // Always search on username and email with a regex for a flexible search
        orClauses.push({ username: { $regex: search, $options: 'i' } });
        orClauses.push({ email: { $regex: search, $options: 'i' } });

        // Only add the _id clause if the search term is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(search)) {
            orClauses.push({ _id: search });
        }

        const filter = orClauses.length > 0 ? { $or: orClauses } : {};

        const users = await User.find(filter).limit(limit).skip(skip);
        const totalUsers = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers / limit);

        return NextResponse.json({
            users,
            totalPages,
            currentPage: page,
        }, { status: 200 });
    } catch (error: unknown) { // Use 'unknown' type for caught errors
        console.error("Error fetching users:", error);
        let errorMessage = "Failed to fetch users";
        if (error instanceof Error) { // Type guard to safely access error properties
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}