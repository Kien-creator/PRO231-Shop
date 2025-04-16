const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // Tên chương trình
    code: { type: String, required: true, unique: true, trim: true }, // Mã giảm giá
    discount: { type: Number, required: true, min: 0 }, // Giá trị giảm
    type: { type: String, enum: ["percentage", "fixed"], required: true }, // Loại giảm giá
    startDate: { type: Date, required: true }, // Ngày bắt đầu
    endDate: { type: Date, required: true }, // Ngày kết thúc
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promotion", promotionSchema);