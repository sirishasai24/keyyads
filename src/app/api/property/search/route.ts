import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/dbConfig/dbConfig';
import Property from '@/models/propertyModel';

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const filters: Record<string, unknown> = {};

    // Location: case-insensitive partial match
    const location = searchParams.get('location');
    if (location) {
      filters['location.city'] = { $regex: location, $options: 'i' };
    }

    // Exact match fields
    const exactMatchKeys = ['transactionType', 'type', 'furnishing', 'facing'];
    exactMatchKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        filters[key] = value;
      }
    });

    // Minimum bedrooms
    const bedrooms = parseInt(searchParams.get('bedrooms') || '');
    if (!isNaN(bedrooms)) {
      filters.bedrooms = { $gte: bedrooms };
    }

    // Minimum bathrooms
    const bathrooms = parseInt(searchParams.get('bathrooms') || '');
    if (!isNaN(bathrooms)) {
      filters.bathrooms = { $gte: bathrooms };
    }

    // Max price
    const maxPrice = parseInt(searchParams.get('maxPrice') || '');
    if (!isNaN(maxPrice)) {
      filters.price = { $lte: maxPrice };
    }

    // Property Age → builtYear calculation
    const propertyAge = searchParams.get('propertyAge');
    if (propertyAge) {
      const currentYear = new Date().getFullYear();

      if (propertyAge === 'new') {
        filters.builtYear = { $gte: currentYear - 1 };
      } else if (propertyAge === '<5 Years') {
        filters.builtYear = { $gte: currentYear - 5 };
      } else if (propertyAge === '5-10 Years') {
        filters.builtYear = {
          $gte: currentYear - 10,
          $lte: currentYear - 5,
        };
      } else if (propertyAge === '>10 Years') {
        filters.builtYear = { $lte: currentYear - 10 };
      }
    }

    console.log('Applied Filters:', filters);

    const properties = await Property.find(filters).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, properties });
  } catch (err) {
    console.error('Error fetching properties:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching properties',
        error: err,
      },
      { status: 500 }
    );
  }
}
