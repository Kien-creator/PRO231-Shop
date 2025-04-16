const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const Review = require("../models/review");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", async (req, res, next) => {
  try {
    const { search, categoryId, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (categoryId) query.categoryId = categoryId;

    const products = await Product.find(query)
      .populate("categoryId")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// Move /categories before /:id
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId")
      .populate({
        path: "reviews",
        populate: { path: "userId", select: "username" },
      });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/reviews", authMiddleware, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = new Review({
      userId: req.user.id,
      productId: req.params.id,
      rating,
      comment,
    });
    await review.save();

    product.reviews.push(review._id);
    await product.save();

    const populatedReview = await Review.findById(review._id).populate("userId", "username");
    res.status(201).json({ message: "Review added successfully", review: populatedReview });
  } catch (err) {
    next(err);
  }
});

module.exports = router;