import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true
  },
  phone: {
    type: Number,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: "User"
  },
  profileImageURL: {
    type: String,
    default: "/profile.png"
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  hashedEmail: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  plan: {
    type: String,
    enum: ["Free", "Quarterly Plan", "Half Yearly Plan", "Annual Plan"],
    default: "Free"
  },
  listings: {
    type: Number,
    default: 1
  },
  premiumBadging: {
    type: Number,
    default: 0
  },
  shows:{
    type:Number,
    default: 0
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    default: null
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
