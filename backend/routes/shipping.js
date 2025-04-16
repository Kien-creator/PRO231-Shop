const express = require("express");
const router = express.Router();
const Shipping = require("../models/shipping");
const authMiddleware = require("../middlewares/authMiddleware");

// Lấy danh sách thông tin vận chuyển (có phân trang)
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shippings = await Shipping.find({ userId: req.user.id })
      .skip(skip)
      .limit(limit);

    const total = await Shipping.countDocuments({ userId: req.user.id });

    res.status(200).json({
      shippings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Lấy chi tiết thông tin vận chuyển
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const shipping = await Shipping.findById(req.params.id);
    if (!shipping) {
      return res.status(404).json({ message: "Shipping info not found" });
    }
    if (shipping.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.status(200).json(shipping);
  } catch (err) {
    next(err);
  }
});

// Thêm thông tin vận chuyển
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { address, city, postalCode, country } = req.body;
    if (!address || !city || !postalCode || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const shipping = new Shipping({
      userId: req.user.id,
      address,
      city,
      postalCode,
      country,
    });
    await shipping.save();

    res.status(201).json({ message: "Shipping info added successfully", shipping });
  } catch (err) {
    next(err);
  }
});

// Cập nhật thông tin vận chuyển
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { address, city, postalCode, country } = req.body;
    const shipping = await Shipping.findById(req.params.id);
    if (!shipping) {
      return res.status(404).json({ message: "Shipping info not found" });
    }
    if (shipping.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (address) shipping.address = address;
    if (city) shipping.city = city;
    if (postalCode) shipping.postalCode = postalCode;
    if (country) shipping.country = country;

    await shipping.save();

    res.status(200).json({ message: "Shipping info updated successfully", shipping });
  } catch (err) {
    next(err);
  }
});

// Xóa thông tin vận chuyển
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const shipping = await Shipping.findById(req.params.id);
    if (!shipping) {
      return res.status(404).json({ message: "Shipping info not found" });
    }
    if (shipping.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await shipping.remove();
    res.status(200).json({ message: "Shipping info deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;