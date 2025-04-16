const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    sold: { type: Number, default: 0 },
    description: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    images: [{ type: String }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);