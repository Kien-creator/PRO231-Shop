const Promotion = require("../models/promotion");

module.exports = async (req, res, next) => {
  try {
    const { promotionCode } = req.body;
    if (!promotionCode) {
      return next(); // Không có mã giảm giá, bỏ qua
    }

    const promotion = await Promotion.findOne({ code: promotionCode });
    if (!promotion) {
      return res.status(400).json({ message: "Invalid promotion code" });
    }

    const now = new Date();
    if (now < promotion.startDate || now > promotion.endDate) {
      return res.status(400).json({ message: "Promotion code is not valid at this time" });
    }

    req.promotion = promotion; // Lưu thông tin mã giảm giá để dùng trong controller
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};