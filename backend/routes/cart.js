const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/cart");
const authenticateToken = require("../middleware/auth");

async function fetchCart(userId) {
  return await Cart.findOne({ userId }).populate("items.productId");
}

function handleError(res, err, message) {
  res.status(500).json({ message: "Server error", details: err.message });
}

router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined || quantity === null) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    let cart = await fetchCart(req.user.id);
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => {
      if (!item.productId) {
        return false;
      }
      return item.productId.toString() === productId;
    });

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      const productObjectId = new mongoose.Types.ObjectId(productId);
      cart.items.push({ productId: productObjectId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    handleError(res, err, "POST /add - Error:");
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const cart = await fetchCart(req.user.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (err) {
    handleError(res, err, "GET / - Error:");
  }
});

router.put("/update/:itemId", authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await fetchCart(req.user.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await fetchCart(req.user.id);
    res.status(200).json(updatedCart);
  } catch (err) {
    handleError(res, err, "PUT /update - Error:");
  }
});

router.delete("/remove/:itemId", authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await fetchCart(req.user.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const updatedCart = await fetchCart(req.user.id);
    res.status(200).json(updatedCart);
  } catch (err) {
    handleError(res, err, "DELETE /remove - Error:");
  }
});

router.delete("/clear", authenticateToken, async (req, res) => {
  try {
    await Cart.deleteOne({ userId: req.user.id });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    handleError(res, err, "DELETE /clear - Error:");
  }
});

module.exports = router;