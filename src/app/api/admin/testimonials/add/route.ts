import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import Review from "@/models/reviewModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: NextRequest) {
  try {
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, review, rating, location, profileImageURL } = body; // Destructure profileImageURL

    if (!username || !review || !location || rating <= 0 || !profileImageURL) { // Add profileImageURL to validation
      return NextResponse.json(
        { message: "All fields including profile image are required." }, // Update message
        { status: 400 }
      );
    }

    await connectDb();

    const newTestimonial = new Review({
      username,
      review,
      rating,
      location,
      profileImageURL, // Save the image URL
      createdBy: userId,
    });

    await newTestimonial.save();

    return NextResponse.json({ message: "Testimonial saved successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error saving testimonial:", error);
    // You might want to differentiate between specific errors or log more detail
    return NextResponse.json({ message: "Server error saving testimonial." }, { status: 500 });
  }
}