const Order = require("../models/order");
const OrderDetail = require("../models/orderDetail");
const { generateCode, formatPrice } = require("../helpers/helper");

const createOrder = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    let total = 0;

    const orderDetails = await Promise.all(
      items.map(async (item) => {
        const orderDetail = new OrderDetail({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
        await orderDetail.save();
        total += item.price * item.quantity;
        return orderDetail._id;
      })
    );

    if (req.promotion) {
      const { discount, type } = req.promotion;
      if (type === "percentage") {
        total -= (total * discount) / 100;
      } else {
        total -= discount;
      }
    }

    const orderCode = generateCode("DH-"); // Sử dụng Helper
    const newOrder = new Order({ userId, orderCode, items: orderDetails, total, address });
    await newOrder.save();

    res.status(201).json({
      message: "Order created",
      order: { ...newOrder._doc, total: formatPrice(newOrder.total) }, // Định dạng giá
    });
  } catch (err) {
    next(err);
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items");
    const formattedOrders = orders.map(order => ({
      ...order._doc,
      total: formatPrice(order.total), // Định dạng giá
    }));
    res.status(200).json(formattedOrders);
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getUserOrders };