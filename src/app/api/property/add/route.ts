import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import Property from "@/models/propertyModel"; // Ensure this path is correct
import User from "@/models/userModel"; // Import the User model
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDb();

  try {
    const data = await req.json();

    const userId = await getDataFromToken(req);
    console.log("User ID from token:", userId);

    // Destructure all expected fields from the frontend form
    const {
      username,
      contact,
      address,
      title,
      type, // 'land' or 'building'
      saleType, // Frontend uses 'saleType', backend maps to 'transactionType'
      landCategory, // Will be undefined if type is 'building' from frontend
      floors, // Will be undefined if type is 'land'
      bedrooms, // Will be undefined if type is 'land'
      bathrooms, // Will be undefined if type is 'land'
      propertyAge, // Will be undefined if type is 'land'
      furnishing, // Will be undefined if type is 'land'
      facing,
      otherDetails,
      description,
      area,
      areaUnit,
      price,
      discount,
      parking, // Will be undefined if type is 'land'
      state,
      city,
      images,
      isPremium,
    } = data;

    // --- Server-Side Initial Validation (before Mongoose full validation) ---
    // These are checks for fundamental missing data that would prevent Mongoose from even running
    if (
      !title ||
      !username ||
      !contact ||
      !address ||
      !type ||
      !saleType ||
      area === undefined || // Check for undefined/null, as 0 could be valid for area
      !areaUnit ||
      price === undefined || // Check for undefined/null
      !state ||
      !city ||
      isPremium === undefined || // Boolean value, so check for undefined explicitly
      !userId // Ensure userId is successfully retrieved
    ) {
      return NextResponse.json(
        { success: false, message: "Missing one or more primary required fields. Please check all mandatory fields (title, username, contact, address, type, saleType, area, areaUnit, price, state, city, premium status)." },
        { status: 400 }
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required." },
        { status: 400 }
      );
    }

    // Mongoose schema's conditional 'required' will handle `landCategory`, `floors`, etc.

    const propertyLocation = {
      state,
      city,
      // Include lat/lng only if they are provided, otherwise Mongoose defaults will apply
      lat: data.location?.lat,
      lng: data.location?.lng,
    };

    const newProperty = new Property({
      username,
      contact,
      address,
      title,
      type,
      transactionType: saleType, // Map frontend 'saleType' to backend 'transactionType'
      area,
      areaUnit,
      price,
      location: propertyLocation,
      images,
      isPremium,
      createdBy: userId,

      // Assign optional/conditional fields directly.
      // Mongoose's schema will handle the 'required' checks
      // and cast types based on the 'type' of the property.
      description: description || undefined,
      discount: discount || undefined, // Discount applies to both
      facing: facing === 'Not Specified' ? undefined : facing, // Don't save "Not Specified"

      // Building specific fields - pass them directly.
      // If `type` is 'land', these will be undefined and Mongoose won't require them.
      floors: floors || undefined,
      parking: parking || undefined,
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
      propertyAge: propertyAge || undefined,
      furnishing: furnishing || undefined,
      otherDetails: otherDetails || undefined,

      // Land specific fields - pass directly.
      // If `type` is 'building', this will be undefined and Mongoose won't require it.
      landCategory: landCategory || undefined,
    });

    await newProperty.save();

    console.log("Property saved successfully:", newProperty);

    // --- Update user's listings and premiumBadging ---
    const user = await User.findById(userId);

    if (user) {
      // Decrement listings count
      if (user.listings > 0) {
        user.listings -= 1;
      } else {
        // Handle case where listings might already be 0, though client-side should prevent this
        console.warn("User listings already 0 for user:", userId);
      }

      // Decrement premiumBadging if property is premium
      if (isPremium && user.premiumBadging > 0) {
        user.premiumBadging -= 1;
      } else if (isPremium && user.premiumBadging === 0) {
        console.warn("User premium badging already 0 for user:", userId);
      }
      await user.save();
      console.log("User listings and premium badging updated successfully.");
    } else {
      console.warn("User not found with ID:", userId, "Cannot update listings/badging.");
    }
    // --- End of user update logic ---

    return NextResponse.json(
      {
        success: true,
        message: "Property submitted successfully!",
        data: newProperty,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving property:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message || "An unexpected error occurred." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error. Please try again." },
      { status: 500 }
    );
  }
}