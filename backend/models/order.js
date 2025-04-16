const mongoose = require("mongoose");

// Tách address thành một schema riêng để tái sử dụng
const addressSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  ward: { type: String, required: true, trim: true },
  specificAddress: { type: String, required: true, trim: true },
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Liên kết với User
    orderCode: { type: String, required: true, unique: true }, // Mã đơn hàng (VD: "DH-123456")
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderDetail" }], // Liên kết với OrderDetail
    total: { type: Number, required: true, min: 0 }, // Tổng tiền
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
      default: "pending",
    }, // Trạng thái đơn hàng
    address: addressSchema, // Địa chỉ giao hàng
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Chuyển khoản", "MoMo", "COD"], // Các phương thức thanh toán thủ công
      default: "Chuyển khoản",
    }, // Phương thức thanh toán
    paymentStatus: {
      type: String,
      enum: ["Chưa thanh toán", "Đã thanh toán", "Thất bại"],
      default: "Chưa thanh toán",
    }, // Trạng thái thanh toán
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

module.exports = mongoose.model("Order", orderSchema);