const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const auth = require("../middleware/auth");

const handleError = (res, err, message) => {
  res.status(500).json({ error: "Server error", details: err.message });
};

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (err) {
    handleError(res, err, "GET /products - Error:");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    handleError(res, err, "GET /products/:id - Error:");
  }
});

router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.comments.push({ username: req.user.username, comment });
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    handleError(res, err, "POST /products/:id/comment - Error:");
  }
});

router.post("/:id/rate", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { rating } = req.body;
    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!Array.isArray(product.ratings)) {
      product.ratings = [];
    }

    const existingRatingIndex = product.ratings.findIndex(
      (r) => r.userId.toString() === req.user.id
    );

    if (existingRatingIndex !== -1) {
      product.ratings[existingRatingIndex].rating = rating;
    } else {
      product.ratings.push({ userId: req.user.id, rating });
    }

    const totalRatings = product.ratings.length;
    const sumRatings = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    product.markModified("ratings");

    await product.save();

    const updatedProduct = await Product.findById(req.params.id);

    res.status(200).json(updatedProduct);
  } catch (err) {
    handleError(res, err, "POST /products/:id/rate - Error:");
  }
});

module.exports = router;