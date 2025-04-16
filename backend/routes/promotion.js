const express = require("express");
const router = express.Router();
const Promotion = require("../models/promotion");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Lấy danh sách mã giảm giá (có phân trang)
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const promotions = await Promotion.find()
      .skip(skip)
      .limit(limit);

    const total = await Promotion.countDocuments();

    res.status(200).json({
      promotions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Lấy chi tiết mã giảm giá
router.get("/:id", async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json(promotion);
  } catch (err) {
    next(err);
  }
});

// Thêm mã giảm giá (admin)
router.post("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { code, discount, startDate, endDate } = req.body;
    if (!code || !discount || !startDate || !endDate) {
      return res.status(400).json({ message: "Code, discount, startDate, and endDate are required" });
    }

    const promotion = new Promotion({ code, discount, startDate, endDate });
    await promotion.save();

    res.status(201).json({ message: "Promotion created successfully", promotion });
  } catch (err) {
    next(err);
  }
});

// Cập nhật mã giảm giá (admin)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { code, discount, startDate, endDate } = req.body;
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    if (code) promotion.code = code;
    if (discount) promotion.discount = discount;
    if (startDate) promotion.startDate = startDate;
    if (endDate) promotion.endDate = endDate;

    await promotion.save();

    res.status(200).json({ message: "Promotion updated successfully", promotion });
  } catch (err) {
    next(err);
  }
});

// Xóa mã giảm giá (admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;