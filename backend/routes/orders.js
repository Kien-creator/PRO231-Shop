const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/cart");
const User = require("../models/user");
const auth = require("../middleware/auth");

const handleError = (res, err, message = "Server error") => {
  res.status(500).json({ message, details: err.message });
};

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { selectedItemIds } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const itemsToOrder = selectedItemIds
      ? cart.items.filter((item) => selectedItemIds.includes(item._id.toString()))
      : cart.items;

    if (itemsToOrder.length === 0) {
      return res.status(400).json({ message: "No items selected for the order" });
    }

    const total = itemsToOrder.reduce(
      (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
      0
    );

    const user = await User.findById(req.user.id);
    if (!user || !user.address) {
      return res.status(400).json({ message: "User address is required" });
    }

    const order = new Order({
      userId: req.user.id,
      items: itemsToOrder.map((item) => ({
        productId: item.productId?._id,
        quantity: item.quantity,
      })),
      total,
      address: user.address,
    });

    await order.save();

    cart.items = cart.items.filter(
      (item) => !selectedItemIds.includes(item._id.toString())
    );
    await cart.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;