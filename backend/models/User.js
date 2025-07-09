const mongoose =require("mongoose") ;
const { USER_ROLES } = require("../constants/userEnums");
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
      required: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "student",
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

module.exports = mongoose.model("User", UserSchema);
