// app/api/property/[id]/related/route.ts
import {  NextResponse } from 'next/server';
import { connectDb } from '@/dbConfig/dbConfig'; 
import Property from '@/models/propertyModel'; 

connectDb(); 

interface Query{
  _id?: { $ne: string };
  type?: string;
  transactionType?: string;
  'location.city'?: string;
  furnishing?: string;
  landCategory?: string;
}

export async function GET(
  context: { params: { id: string } } // Use 'context' as the parameter name
) {
  // Await the params object before destructuring
  const { id } = await context.params; // <--- The crucial change here

  try {
    // Find the current property
    const currentProperty = await Property.findById(id);

    if (!currentProperty) {
      return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
    }

    // Define criteria for related properties
    const query: Query = {
      _id: { $ne: id }, // Exclude the current property
      type: currentProperty.type,
      transactionType: currentProperty.transactionType,
      'location.city': currentProperty.location.city,
    };

    // If it's a building, try to find similar furnishing or property age if available
    if (currentProperty.type === 'building') {
      if (currentProperty.furnishing && currentProperty.furnishing !== 'Unfurnished') {
        query.furnishing = currentProperty.furnishing;
      }
      // You could also add propertyAge or approximate price range here for more relevant results
    }

    // If it's land, match by landCategory
    if (currentProperty.type === 'land' && currentProperty.landCategory) {
      query.landCategory = currentProperty.landCategory;
    }

    // Fetch related properties
    const relatedProperties = await Property.find(query)
      .limit(6) // Limit to a few related properties
      .sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json({ success: true, relatedProperties }, { status: 200 });

  } catch (error) {
    console.error('Error fetching related properties:', error);
    // Be more specific with error types if possible, e.g., Mongoose CastError
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', error: error },
      { status: 500 }
    );
  }
}