const mongoose =require("mongoose") ;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Full name (e.g., Potuganti Ajay Kumar)
    },
    username: {
      type: String,
      required: true, // Username for login/display (e.g., ajay_kumar)
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
      enum: ["student", "admin"],
      default: "student",
    },
    img: {
      type: String, // For profile image (URL or file path)
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
