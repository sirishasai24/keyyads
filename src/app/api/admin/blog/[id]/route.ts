import { NextResponse, NextRequest } from 'next/server';
import Blog from '@/models/blogModel';
import User from '@/models/userModel';
import { connectDb } from '@/dbConfig/dbConfig';

connectDb();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const blogId = url.pathname.split('/').pop();

    if (!blogId) {
      return NextResponse.json({ message: 'Blog ID is required' }, { status: 400 });
    }
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }
    const user = await User.findById(blog.createdBy);

    return NextResponse.json(
      { message: 'Blog fetched successfully', blog, user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
