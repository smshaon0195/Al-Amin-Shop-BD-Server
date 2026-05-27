import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// All orders
router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Stats API
router.get("/stats", async (req, res) => {
  const total = await Order.countDocuments();
  const pending = await Order.countDocuments({ status: "pending" });
  const delivered = await Order.countDocuments({ status: "delivered" });

  // last 24h
  const last24h = await Order.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  res.json({
    total,
    pending,
    delivered,
    last24h,
  });
});

export default router;
