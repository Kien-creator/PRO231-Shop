const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");
const Category = require("../models/category");
const Review = require("../models/review");
const Shipping = require("../models/shipping");
const Promotion = require("../models/promotion");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const validateProductMiddleware = require("../middlewares/validateProductMiddleware");
const checkPromotionMiddleware = require("../middlewares/checkPromotionMiddleware");
const { formatPrice, formatDate } = require("../helpers/helper");

// Orders: List all orders for admin
router.get("/orders", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, paymentStatus, paymentMethod, sort } = req.query;
    const query = {};
    if (search) query.orderCode = { $regex: search, $options: "i" };
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    const sortOption = sort === "date-asc" ? { createdAt: 1 } : { createdAt: -1 };

    const orders = await Order.find(query)
      .populate({
        path: "items",
        populate: {
          path: "productId",
          select: "name price images",
        },
      })
      .populate("userId", "username email")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Orders: Update order status
router.put("/orders/:id/status", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status
    const validStatuses = ["pending", "processing", "shipped", "delivered", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Update the order
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate({
        path: "items",
        populate: {
          path: "productId",
          select: "name price images",
        },
      })
      .populate("userId", "username email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find and update the corresponding shipping record
    const shipping = await Shipping.findOne({ orderId: id });
    if (shipping) {
      // Only update shipping status if it's a shipping-related status
      if (["pending", "shipped", "delivered"].includes(status)) {
        shipping.status = status;
        await shipping.save();
      }
    }

    res.status(200).json({ order, message: "Order status updated" });
  } catch (err) {
    next(err);
  }
});

// Orders: Update payment status
router.put("/orders/:id/payment-status", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const validPaymentStatuses = ["Chưa thanh toán", "Đã thanh toán", "Thất bại"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await Order.findById(req.params.id)
      .populate({
        path: "items",
        populate: {
          path: "productId",
          select: "name price images",
        },
      })
      .populate("userId", "username email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({ message: "Payment status updated", order });
  } catch (err) {
    next(err);
  }
});

// Users: List all users
router.get("/users", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role, sort } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) query.role = role;

    const sortOption = sort === "date-asc" ? { createdAt: 1 } : { createdAt: -1 };

    const users = await User.find(query)
      .select("-password")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Users: Toggle admin role
router.put("/users/:id/admin", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.status(200).json({ message: `User role updated to ${user.role}`, user });
  } catch (err) {
    next(err);
  }
});

// Products: Create a product
router.post("/products", [authMiddleware, adminMiddleware, validateProductMiddleware], async (req, res, next) => {
  try {
    const { name, price, images, stock, description, categoryId } = req.body;
    const product = new Product({ name, price, images, stock, description, categoryId });
    await product.save();
    res.status(201).json({ message: "Tạo sản phẩm thành công", product });
  } catch (err) {
    next(err);
  }
});

// Products: Update a product
router.put("/products/:id", [authMiddleware, adminMiddleware, validateProductMiddleware], async (req, res, next) => {
  try {
    const { name, price, images, stock, description, categoryId } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name;
    product.price = price;
    product.images = images;
    product.stock = stock;
    product.description = description;
    product.categoryId = categoryId;
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    next(err);
  }
});

// Products: Delete a product
router.delete("/products/:id", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// Categories: Create a category
router.post("/categories", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (err) {
    next(err);
  }
});

// Categories: List all categories
router.get("/categories", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
});

// Reviews: List all reviews
router.get("/reviews", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate("userId", "username email")
      .populate("productId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments();

    res.status(200).json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Reviews: Delete a review
router.delete("/reviews/:id", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// Shipping: List all shipping records
router.get("/shippings", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.orderId) query.orderId = req.query.orderId;

    const shippings = await Shipping.find(query)
      .populate("orderId", "orderCode")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Shipping.countDocuments(query);

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

// Shipping: Update shipping status
router.put("/shippings/:id", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;
    if (status && !["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid shipping status" });
    }

    const shipping = await Shipping.findById(req.params.id);
    if (!shipping) {
      return res.status(404).json({ message: "Shipping record not found" });
    }

    if (status) shipping.status = status;
    if (trackingNumber) shipping.trackingNumber = trackingNumber;

    await shipping.save();
    res.status(200).json({ message: "Shipping updated successfully", shipping });
  } catch (err) {
    next(err);
  }
});

// Shipping: Update shipping record (with estimated delivery)
router.put("/:id", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, estimatedDelivery } = req.body;

    // Validate the status
    const validStatuses = ["pending", "shipped", "delivered", "canceled"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Update the shipping record
    const shipping = await Shipping.findByIdAndUpdate(
      id,
      { status, estimatedDelivery },
      { new: true }
    );
    if (!shipping) {
      return res.status(404).json({ message: "Shipping record not found" });
    }

    // Update the corresponding order
    const order = await Order.findById(shipping.orderId);
    if (order) {
      order.status = status; // Sync the order status with the shipping status
      await order.save();
    }

    res.status(200).json({ shipping, message: "Shipping updated successfully" });
  } catch (err) {
    next(err);
  }
});

// Promotions: Create a promotion
router.post(
  "/promotions",
  [authMiddleware, adminMiddleware, checkPromotionMiddleware],
  async (req, res, next) => {
    try {
      const { name, code, discount, type, startDate, endDate } = req.body;
      const existingPromotion = await Promotion.findOne({ code });
      if (existingPromotion) {
        return res.status(400).json({ message: "Promotion code already exists" });
      }

      const promotion = new Promotion({
        name,
        code,
        discount,
        type,
        startDate,
        endDate,
      });
      await promotion.save();
      res.status(201).json({ message: "Promotion created successfully", promotion });
    } catch (err) {
      next(err);
    }
  }
);

// Promotions: List all promotions
router.get("/promotions", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const promotions = await Promotion.find()
      .sort({ createdAt: -1 })
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

// Promotions: Delete a promotion
router.delete("/promotions/:id", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    await promotion.deleteOne();
    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// General stats (users, orders, products)
router.get("/:type", [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10 } = req.query;

    let Model, data, total;
    switch (type) {
      case "users":
        Model = User;
        data = await Model.find()
          .select("-password")
          .skip((page - 1) * limit)
          .limit(parseInt(limit));
        total = await Model.countDocuments();
        break;
      case "orders":
        Model = Order;
        data = await Model.find()
          .populate("userId", "username email")
          .skip((page - 1) * limit)
          .limit(parseInt(limit));
        total = await Model.countDocuments();
        break;
      case "products":
        Model = Product;
        data = await Model.find()
          .populate("categoryId")
          .skip((page - 1) * limit)
          .limit(parseInt(limit));
        total = await Model.countDocuments();
        break;
      default:
        return res.status(400).json({ message: "Invalid type" });
    }

    res.status(200).json({
      [type]: data,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;