import { NextResponse } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import Property from "@/models/propertyModel";
connectDb();

export async function GET() {
  try {
   
    const properties = await Property.find({isApproved:true}).sort({
      createdAt: -1,
    });
    if (!properties) {
      return NextResponse.json(
        { error: "No properties found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ properties }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error:error },
      {status: 500}
    );
  }
}
