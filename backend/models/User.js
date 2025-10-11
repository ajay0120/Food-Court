import mongoose from "mongoose";
import { USER_ROLES } from "../../common/userEnums.js";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
    },
    username: {
      type: String,
      required: true, 
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function() { return !this.googleId; }, // Password not required for Google OAuth users
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents without googleId
    },
    profilePicture: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.STUDENT,
    },
    verified: {
      type: Boolean,
      default: false, 
    },
    otpTries: { 
      type: Number, 
      default: 0,
    },
    img: {
      type: String, 
      default: null,
    },
    favourites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Food",
      default: [],
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Orders",
      default: [],
    },
    cart: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
          quantity: { type: Number, default: 1 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
