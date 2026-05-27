import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST add product
router.post("/", async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

// DELETE product
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;