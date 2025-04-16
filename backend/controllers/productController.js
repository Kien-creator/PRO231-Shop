const Product = require("../models/product");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId");
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, categoryId, stock, images } = req.body;
    const newProduct = new Product({ name, price, description, categoryId, stock, images });
    await newProduct.save();
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };