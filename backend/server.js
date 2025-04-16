const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Khởi tạo biến môi trường
dotenv.config();

// Khởi tạo ứng dụng
const app = express();
const port = 5000;

// Middleware cơ bản
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Kết nối các route
const userRoutes = require("./routes/user"); 
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const adminRoutes = require("./routes/admin");
const categoryRoutes = require("./routes/category");
const reviewRoutes = require("./routes/review");
const promotionRoutes = require("./routes/promotion");
const shippingRoutes = require("./routes/shipping");

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/shipping", shippingRoutes);

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});