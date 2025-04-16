const Review = require("../models/review");

const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const newReview = new Review({
      productId,
      userId: req.user.id,
      rating,
      comment,
    });
    await newReview.save();
    res.status(201).json({ message: "Review added", review: newReview });
  } catch (err) {
    next(err);
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).populate("userId", "username");
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

module.exports = { addReview, getProductReviews };