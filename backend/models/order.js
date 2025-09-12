import mongoose from "mongoose";
import { ORDER_STATUSES, PAYMENT_METHODS } from "../../common/orderEnums.js";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: PAYMENT_METHODS,
    required: true,
  },
  status: {
    type: String,
    enum: ORDER_STATUSES,
    default: "Placed",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
