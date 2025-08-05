import { connectDb } from "@/dbConfig/dbConfig";
import Blog from "@/models/blogModel";
import { NextRequest, NextResponse } from "next/server";
connectDb();

export async function DELETE(request:NextRequest) {
  try {

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    await Blog.deleteOne({ _id: id });

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
