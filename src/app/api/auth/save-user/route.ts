import { NextRequest, NextResponse } from "next/server";
import {connectDb} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const {_id, username, email, profileImageURL } = body;
    
    // The social sign-in process doesn't provide a traditional password,
    // so we use the user's ID as a placeholder.
    const password=_id;

    let user = await User.findOne({ email });
    if (!user) {
      try {
        user = await User.create({ username, email, profileImageURL, password, isVerified: true });
      } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
      }
    }

    // Check if the user is an admin
    const isAdmin = user.role === 'Admin';
    const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role, 
        isAdmin: isAdmin,
    };
    
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: "1d" });
    
    const response = NextResponse.json({
        user,
        message: "Login successful",
        success: true,
    });
    
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
    
    // Set a separate admin-token cookie if the user is an admin
    if (isAdmin) {
        const adminToken = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET!);
        response.cookies.set("admin-token", adminToken, {
            httpOnly: true
           
        });
    }
    
        response.cookies.set("token", token, {
        httpOnly: true,
    });
    

    return response;
  } catch (error) {
    console.error("Error during social sign-in:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}