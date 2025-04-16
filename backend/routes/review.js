const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const authMiddleware = require("../middlewares/authMiddleware");

// Lấy danh sách đánh giá (có phân trang)
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate("userId")
      .populate("productId")
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments();

    res.status(200).json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Lấy đánh giá theo sản phẩm
router.get("/product/:productId", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ productId: req.params.productId })
      .populate("userId")
      .populate("productId")
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ productId: req.params.productId });

    res.status(200).json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Thêm đánh giá
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) {
      return res.status(400).json({ message: "Product ID and rating are required" });
    }

    const review = new Review({
      userId: req.user.id,
      productId,
      rating,
      comment,
    });
    await review.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    next(err);
  }
});

// Cập nhật đánh giá
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (err) {
    next(err);
  }
});

// Xóa đánh giá
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.remove();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;