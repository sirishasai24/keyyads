import { NextResponse, NextRequest } from 'next/server';
import Property from '@/models/propertyModel';
import User from '@/models/userModel';
import { connectDb } from '@/dbConfig/dbConfig';

connectDb();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const propertyId = url.pathname.split('/').pop();
    if(!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    const userId=property.createdBy;
    // 💡 Add 'plan' to the fields to be selected for the seller
    const user = await User.findById(userId).select('username phone email profileImageURL plan');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Return both the property and the user (seller) with their plan
    return NextResponse.json({ property, user }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}