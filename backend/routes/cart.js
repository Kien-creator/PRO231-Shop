const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/product");
const authMiddleware = require("../middlewares/authMiddleware");

// routes/cart.js
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json([]);
    }

    // Filter out items where productId is null
    cart.items = cart.items.filter((item) => item.productId !== null);

    await cart.save();

    res.status(200).json(cart.items);
  } catch (err) {
    next(err);
  }
});

router.post("/add", authMiddleware, async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    next(err);
  }
});

router.delete("/remove/:productId", authMiddleware, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (err) {
    next(err);
  }
});

module.exports = router;