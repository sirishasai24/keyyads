import {  NextResponse } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import Review from "@/models/reviewModel";


export async function GET() {
  try {
    await connectDb();
    const testimonials = await Review.find().sort({ createdAt: -1 });
    return NextResponse.json({ testimonials });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching testimonials" ,error}, { status: 500 });
  }
}
