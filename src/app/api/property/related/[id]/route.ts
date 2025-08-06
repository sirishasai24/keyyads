// app/api/property/[id]/related/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDb } from '@/dbConfig/dbConfig';
import Property from '@/models/propertyModel';

connectDb();

interface Query {
  _id?: { $ne: string };
  type?: string;
  transactionType?: string;
  'location.city'?: string;
  furnishing?: string;
  landCategory?: string;
  isApproved?: boolean;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  // Ensure id is a string before proceeding
  if (!id) {
    return NextResponse.json({ success: false, message: 'Property ID is missing' }, { status: 400 });
  }

  try {
    const currentProperty = await Property.findById(id);

    if (!currentProperty) {
      return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
    }

    const query: Query = {
      _id: { $ne: id },
      type: currentProperty.type,
      transactionType: currentProperty.transactionType,
      'location.city': currentProperty.location.city,
      isApproved: true,
    };

    if (currentProperty.type === 'building') {
      if (currentProperty.furnishing && currentProperty.furnishing !== 'Unfurnished') {
        query.furnishing = currentProperty.furnishing;
      }
    }

    if (currentProperty.type === 'land' && currentProperty.landCategory) {
      query.landCategory = currentProperty.landCategory;
    }

    const relatedProperties = await Property.find(query)
      .limit(6)
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, relatedProperties }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error fetching related properties:', error);

    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, message: errorMessage, error: error },
      { status: 500 }
    );
  }
}