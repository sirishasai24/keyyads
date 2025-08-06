// src/types/property.ts
export interface Property {
  _id: string;
  title: string;
  username: string;
  contact: string;
  address: string;
  type: "land" | "building";
  transactionType: "sale" | "rent";
  price: number;
  discount?: number;
  floors?: number;
  parking?: number;
  landCategory?: "Agricultural" | "Residential" | "Commercial";
  bedrooms?: string;
  bathrooms?: string;
  propertyAge?: "New" | "<5 Years" | "5-10 Years" | ">10 Years";
  furnishing?: "Unfurnished" | "Semi-furnished" | "Fully-furnished";
  facing?:
    | "Not Specified"
    | "North"
    | "South"
    | "East"
    | "West"
    | "North-East"
    | "North-West"
    | "South-East"
    | "South-West";
  otherDetails?: string;
  isPremium: boolean;
  area: number;
  areaUnit: "sqft" | "sqyd" | "sqm" | "acres";
  location: {
    state: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  images: string[];
  isApproved: boolean; 
  description?: string;
  createdAt: string; // Date string
  createdBy: string; // User ID
  __v?: number; // Mongoose version key
}