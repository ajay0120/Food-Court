const mongoose = require("mongoose");
const { FOOD_TYPES, FOOD_CATEGORIES} = require("../../common/foodEnums");

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
      validate: {
        validator: function (value) {
          return /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(value);
        },
        message: "Invalid image URL format",
      },
      default: "https://placeholder.com/food-image",
    },
    price: {
      type: {
        org: { type: Number, default: 0.0 },
        mrp: {
          type: Number,
          validate: {
            validator: function (v) {
              return v >= this.org;
            },
            message: "Org price cannot be more than mrp",
          },
          default: 0.0,
        },
        off: { type: Number, default: 0 },
      },
      default: { org: 0.0, mrp: 0.0, off: 0 },
    },
    type: {
      type: String,
      enum: FOOD_TYPES,
      required: true,
    },
    category: {
      type: [String],
      enum: FOOD_CATEGORIES,
      default: [],
      index: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", FoodSchema);
