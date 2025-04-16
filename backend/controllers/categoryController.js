const Category = require("../models/category");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json({ message: "Category created", category: newCategory });
  } catch (err) {
    next(err);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = { createCategory, getAllCategories };