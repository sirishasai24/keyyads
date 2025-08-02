import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema( // Removed `new` before mongoose.Schema
  {
    username: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    profileImageURL: { // Ensure this field is present and required
      type: String,
      required: true,
      default:"profile.png"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;