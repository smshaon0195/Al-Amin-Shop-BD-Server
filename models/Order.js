import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    default: "pending", // pending / delivered
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
