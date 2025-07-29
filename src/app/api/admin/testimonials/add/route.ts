// app/api/testimonials/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import Review from "@/models/reviewModel"
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: NextRequest) {
  try {
    const userId=await getDataFromToken(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    const body = await req.json();
    const { username, review, rating, location } = body;

    if (!username || !review || !location || rating <= 0) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    await connectDb();

    const newTestimonial = new Review({
      username,
      review,
      rating,
      location,
      createdBy: userId,
    });

    await newTestimonial.save();

    return NextResponse.json({ message: "Testimonial saved successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error saving testimonial:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
