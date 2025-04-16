const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // Liên kết với Order
    method: { type: String, required: true, trim: true }, // Phương thức vận chuyển
    fee: { type: Number, required: true, min: 0 }, // Phí vận chuyển
    status: { type: String, enum: ["pending", "shipped", "delivered"], default: "pending" }, // Trạng thái giao hàng
    trackingNumber: { type: String, trim: true }, // Mã theo dõi
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipping", shippingSchema);