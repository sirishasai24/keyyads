import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import bcryptjs from 'bcryptjs';

// Connect to the database
connectDb();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password, phone, role, plan, isVerified, isActive, listings, premiumBadging, shows } = reqBody;

        // Check if user already exists by email or username
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 });
        }

        // --- IMPORTANT: Hash the password for security ---
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Store the hashed password
            phone,
            role,
            plan,
            isVerified,
            isActive,
            listings,
            premiumBadging,
            shows,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Return a success response
        return NextResponse.json({
            message: "User created successfully",
            user: savedUser,
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating new user:", error);
        return NextResponse.json({ error: "Failed to create user", details: error }, { status: 500 });
    }
}