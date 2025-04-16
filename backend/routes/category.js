const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Lấy danh sách danh mục (có phân trang)
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find()
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments();

    res.status(200).json({
      categories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Lấy chi tiết danh mục
router.get("/:id", async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
});

// Thêm danh mục (admin)
router.post("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ message: "Category created successfully", category });
  } catch (err) {
    next(err);
  }
});

// Cập nhật danh mục (admin)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    res.status(200).json({ message: "Category updated successfully", category });
  } catch (err) {
    next(err);
  }
});

// Xóa danh mục (admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;