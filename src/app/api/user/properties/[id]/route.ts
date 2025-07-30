// src/app/api/users/properties/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connectDb } from "@/dbConfig/dbConfig";
import Property from "@/models/propertyModel";
import { v2 as cloudinary } from "cloudinary";

connectDb();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageToCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    ).end(buffer);
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;

    const property = await Property.findById(propertyId);

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ property }, { status: 200 });
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const propertyId = params.id;
    const formData = await request.formData();

    const updatedData: { [key: string]: unknown } = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("location[")) {
        const locationKey = key.match(/\[(.*?)\]/)?.[1];
        if (locationKey) {
          if (!updatedData.location) updatedData.location = {};
          (updatedData.location as { [k: string]: unknown })[locationKey] = value;
        }
      } else if (key === "existingImages[]") {
        if (!updatedData.images) updatedData.images = [];
        (updatedData.images as string[]).push(value as string);
      } else if (key === "newImages") {
        // Handled separately
      } else {
        if (["price", "discount", "floors", "parking", "area"].includes(key)) {
          updatedData[key] = parseFloat(value as string);
        } else if (key === "isPremium") {
          updatedData[key] = value === "true";
        } else if (value === "undefined" || value === "null") {
          updatedData[key] = undefined;
        } else {
          updatedData[key] = value;
        }
      }
    }

    const newImageFiles = formData.getAll("newImages") as File[];
    const uploadedImageUrls: string[] = [];

    for (const file of newImageFiles) {
      if (file.size > 0) {
        const imageUrl = await uploadImageToCloudinary(file);
        uploadedImageUrls.push(imageUrl);
      }
    }

    const finalImages = [...((updatedData.images as string[]) || []), ...uploadedImageUrls];
    updatedData.images = finalImages;

    if (finalImages.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required for the property." },
        { status: 400 }
      );
    }

    const property = await Property.findOneAndUpdate(
      { _id: propertyId, createdBy: userId },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!property) {
      return NextResponse.json(
        { error: "Property not found or not authorized to update" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Property updated successfully", property },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating property:", error);
    if (error instanceof Error && (error as any).name === 'ValidationError') {
      const errors: { [key: string]: string } = {};
      for (const field in (error as any).errors) {
        errors[field] = (error as any).errors[field].message;
      }
      return NextResponse.json(
        { error: "Validation Error", details: errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const propertyId = params.id;

    const property = await Property.findOne({
      _id: propertyId,
      createdBy: userId,
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found or not authorized to delete" },
        { status: 404 }
      );
    }

    await Property.deleteOne({ _id: propertyId });

    return NextResponse.json(
      { message: "Property deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}