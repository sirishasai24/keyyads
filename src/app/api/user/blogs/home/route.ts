// /api/user/blogs/home/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/dbConfig/dbConfig';
import Blog from '@/models/blogModel';
// User model is correctly imported, now let's use it for populating
import User from '@/models/userModel'; 

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    // CORRECTED: Added .populate() to fetch author details
    // We populate 'createdBy' and select only the 'username' and '_id' fields from the User model.
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .populate({
        path: 'createdBy',
        select: 'username _id' // Fetch username and ID
      });

    // To match the frontend, let's wrap the response in a 'blogs' object
    return NextResponse.json({ blogs }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching blogs.' },
      { status: 500 }
    );
  }
}