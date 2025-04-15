const mongoose = require("mongoose");


const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      // validate: {
      //   validator: function(value) {
      //     return /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(value);
      //   },
      //   message: "Invalid image URL format",
      // },
      default: "https://placeholder.com/food-image",
    },
    price: {
      type: {
        org: { type: Number, default: 0.0 },
        mrp: { type: Number, default: 0.0 },
        off: { type: Number, default: 0 },
      },
      default: { org: 0.0, mrp: 0.0, off: 0 },
    },
    type: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },
    category: {
      type: [String],
      enum: ["indian", "chinese", "snack", "beverage", "dessert", "continental","american"],
      default: [],
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", FoodSchema);

