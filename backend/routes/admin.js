const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");
const auth = require("../middleware/auth");

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

const handleError = (res, err, message = "Server error") => {
  res.status(500).json({ message, details: err.message });
};

router.get("/orders", auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate([
        { path: "items.productId" },
        { path: "userId", select: "username email" },
      ])
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    handleError(res, err, "Error fetching orders");
  }
});

router.put("/orders/:id/status", auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "On Delivery", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id).populate("items.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "Delivered" && order.status !== "Delivered") {
      for (const item of order.items) {
        const product = item.productId;
        if (product) {
          product.sold += item.quantity;
          product.quantityLeft -= item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    await order.populate([
      { path: "items.productId" },
      { path: "userId", select: "username email" },
    ]);

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    handleError(res, err, "Error updating order status");
  }
});

router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    handleError(res, err, "Error fetching users");
  }
});

router.put("/users/:id/admin", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot change your own admin status" });
    }

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();
    res.status(200).json({ message: "User role updated", user });
  } catch (err) {
    handleError(res, err, "Error toggling admin status");
  }
});

router.post("/products", auth, isAdmin, async (req, res) => {
  try {
    const { name, price, image, quantityLeft } = req.body;
    if (!name || !price || quantityLeft === undefined) {
      return res.status(400).json({ message: "Name, price, and quantity are required" });
    }
    const product = new Product({ name, price, image, quantityLeft });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    handleError(res, err, "Error adding product");
  }
});

router.put("/products/:id", auth, isAdmin, async (req, res) => {
  try {
    const { name, price, image, quantityLeft } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.quantityLeft = quantityLeft !== undefined ? quantityLeft : product.quantityLeft;
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    handleError(res, err, "Error updating product");
  }
});

router.delete("/products/:id", auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    handleError(res, err, "Error deleting product");
  }
});

module.exports = router;