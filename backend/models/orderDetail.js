const mongoose = require("mongoose");

const orderDetailSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // Liên kết với Order
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Liên kết với Product
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderDetail", orderDetailSchema);