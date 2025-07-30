import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connectDb } from "@/dbConfig/dbConfig";
import Property from "@/models/propertyModel";
connectDb();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("User ID from token:", userId);
    const properties = await Property.find({ createdBy: userId }).sort({
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
