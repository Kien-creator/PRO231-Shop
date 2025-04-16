const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const OrderDetail = require("../models/orderDetail");
const Cart = require("../models/cart");
const Shipping = require("../models/shipping");
const Promotion = require("../models/promotion");
const Product = require("../models/product"); // Add this
const authMiddleware = require("../middlewares/authMiddleware");
const checkPromotionMiddleware = require("../middlewares/checkPromotionMiddleware");

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, paymentStatus, paymentMethod, sort } = req.query;
    const query = { userId: req.user.id };

    // Apply filters
    if (search) query.orderCode = { $regex: search, $options: "i" };
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    // Determine sorting order
    const sortOption = sort === "date-asc" ? { createdAt: 1 } : { createdAt: -1 };

    // Fetch orders with nested population
    const orders = await Order.find(query)
      .populate({
        path: "items", // Populate the OrderDetail documents
        populate: {
          path: "productId", // Populate the productId field inside each OrderDetail
          select: "name price images stock", // Fetch only necessary fields
        },
      })
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Count total documents for pagination
    const total = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/checkout", [authMiddleware, checkPromotionMiddleware], async (req, res, next) => {
  try {
    const { address, paymentMethod, promotionCode, items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to checkout" });
    }

    // Validate items and fetch product details
    const populatedItems = [];
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId?._id || item._id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId?._id || item._id} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      populatedItems.push({ productId: product, quantity: item.quantity });
      total += product.price * item.quantity;
    }

    let discount = 0;
    if (req.promotion) {
      discount =
        req.promotion.type === "percentage"
          ? (total * req.promotion.discount) / 100
          : req.promotion.discount;
      total -= discount;
    }

    const orderCode = `DH-${Date.now()}`;
    const order = new Order({
      userId: req.user.id,
      orderCode,
      items: [],
      total,
      address,
      paymentMethod,
    });

    for (const item of populatedItems) {
      const orderDetail = new OrderDetail({
        orderId: order._id,
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      });
      await orderDetail.save();
      order.items.push(orderDetail._id);
      // Update stock
      const product = await Product.findById(item.productId._id);
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    const shipping = new Shipping({
      orderId: order._id,
      method: "Standard",
      fee: 5,
      status: "pending",
    });
    await shipping.save();

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;