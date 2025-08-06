// src/models/propertyModel.ts
import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, "Username must be at least 2 characters long"],
  },
  contact: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+?(\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, "Please enter a valid contact number"],
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: [5, "Address must be at least 5 characters long"],
  },
  type: {
    type: String,
    enum: ["land", "building"], // Expects 'land' or 'building'
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["sale", "rent"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  discount: {
    type: Number,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot be more than 100%"],
    default: 0,
  },
  floors: {
    type: Number,
    min: [0, "Floors cannot be negative"],
  },
  parking: {
    type: Number,
    min: [0, "Parking spots cannot be negative"],
  },
   landCategory: {
    type: String,
    required: function() {
      return this.type === 'land';
    },
    enum: {
      values: ['Agricultural', 'Residential', 'Commercial'],
      message: 'Invalid land category',
    },
  },
  bedrooms: {
    type: String,
  },
  bathrooms: {
    type: String,
  },
  propertyAge: {
    type: String,
    enum: ["New", "<5 Years", "5-10 Years", ">10 Years"],
  },
  furnishing: {
    type: String,
    enum: ["Unfurnished", "Semi-furnished", "Fully-furnished"],
  },
  facing: {
    type: String,
    enum: [
      "Not Specified",
      "North",
      "South",
      "East",
      "West",
      "North-East",
      "North-West",
      "South-East",
      "South-West",
    ],
    default: "Not Specified",
  },
  otherDetails: {
    type: String,
    trim: true,
  },
  isPremium: {
    type: Boolean,
    required: true,
    default: false,
  },
  area: {
    type: Number,
    required: true,
    min: [0, "Area cannot be negative"],
  },
  areaUnit: {
    type: String,
    enum: ["sqft", "sqyd", "sqm", "acres"],
    required: true,
  },
  location: {
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    lat: {
      type: Number,
      required: false,
    },
    lng: {
      type: Number,
      required: false,
    },
  },
  images: {
    type: [String],
    default: [],
    required: [true, "At least one image is required."],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one image is required.'
    }
  },
  description: {
    type: String,
    trim: true,
  },
  isApproved:{
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

PropertySchema.index({ title: 'text', address: 'text', 'location.city': 'text', 'location.state': 'text', description: 'text' });

const Property =
  mongoose.models.Property || mongoose.model("Property", PropertySchema);
export default Property;