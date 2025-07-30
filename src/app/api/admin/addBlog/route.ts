import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import Blog from "@/models/blogModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ message: "Please have a valid token" });
    }

    const { title, body, coverImageURL } = reqBody;

    if (!title || !body || !coverImageURL) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    const blog = await Blog.create({
      title,
      body,
      coverImageURL,
      createdBy: userId,
    });

    return NextResponse.json(
      { message: "Blog Published Successfully", success: true, blog },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error, success: false }, { status: 500 });
  }
}
