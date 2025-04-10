const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  comments: [
    {
      username: String,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      rating: { type: Number, required: true, min: 0, max: 5 },
    },
  ],
  sold: { type: Number, default: 0 },
  quantityLeft: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Product", productSchema);