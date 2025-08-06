import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import mongoose from 'mongoose'; // Import mongoose to use ObjectId validation

export async function GET(request: NextRequest) {
    try {
        await connectDb();

        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        // Build the filter dynamically to avoid the CastError
        const orClauses: any[] = [];

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
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}