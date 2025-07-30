// app/api/property/[id]/related/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/dbConfig/dbConfig';
import Property from '@/models/propertyModel';

connectDb();

interface PropertyQuery {
  _id?: { $ne: string };
  type?: string;
  transactionType?: string;
  'location.city'?: string;
  furnishing?: string;
  landCategory?: string;
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const currentProperty = await Property.findById(id);

    if (!currentProperty) {
      return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
    }

    const query: PropertyQuery = {
      _id: { $ne: id },
      type: currentProperty.type,
      transactionType: currentProperty.transactionType,
      'location.city': currentProperty.location.city,
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

  } catch (error) {
    console.error('Error fetching related properties:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', error: (error as Error).message },
      { status: 500 }
    );
  }
}