const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Liên kết với User
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Liên kết với Product
        quantity: { type: Number, required: true, default: 1, min: 1 }, // Số lượng, không nhỏ hơn 1
      },
    ],
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

module.exports = mongoose.model("Cart", cartSchema);