import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Typography, Spin, Space, Rate, Input, Button, message, InputNumber, Divider } from "antd";
import { useCart } from "../Contexts/CartContext";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Failed to load product:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!rating) {
      message.error("Please provide a rating!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      const updatedProduct = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      setProduct(updatedProduct.data);
    } catch (err) {
      console.error("Failed to submit review:", err.response?.data || err.message);
      message.error("Failed to submit review. Are you logged in?");
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      message.error("This product is out of stock!");
      return;
    }
    if (quantity > product.stock) {
      message.error(`Only ${product.stock} items are in stock!`);
      return;
    }
    addToCart(product, quantity);
    message.success(`${product.name} added to cart!`);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}><Spin size="large" /></div>;
  if (!product) return <div style={{ textAlign: "center", padding: "40px" }}><Text>Product not found.</Text></div>;

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px",
        background: "#E8F5E9",
        borderRadius: "16px",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
      }}
    >
        <Space direction="horizontal" size="large" style={{ width: "100%" }}>
          <div
            style={{
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                }}
              />
            ) : (
              <div
                style={{
                  width: "300px",
                  height: "300px",
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                }}
              >
                <Text type="secondary">Không có ảnh</Text>
              </div>
            )}
          </div>

          <Space direction="vertical" size="middle" style={{ flex: 1 }}>
            <Title level={3} style={{ color: "#1a3c34" }}>
              {product.name}
            </Title>
            <Text style={{ fontSize: "20px", color: "#e91e63", fontWeight: "bold" }}>
              Giá: {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
            </Text>
            <Text style={{ color: "#616161" }}>
              Tồn kho: {product.stock}
            </Text>
            <Text style={{ color: "#616161" }}>
              Mô tả: {product.description || "Không có mô tả."}
            </Text>
            <Space>
              <Text style={{ color: "#616161" }}>
                Số lượng:
              </Text>
              <InputNumber
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(value) => setQuantity(value)}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </Space>
            <Button
              type="primary"
              size="large"
              onClick={handleAddToCart}
              style={{
                background: "#FF9800",
                borderColor: "#FF9800",
                borderRadius: "8px",
                padding: "0 30px",
                height: "48px",
                fontSize: "16px",
                transition: "transform 0.3s ease, background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.backgroundColor = "#FFC107";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "#FF9800";
              }}
            >
              Thêm vào Giỏ Hàng
            </Button>
          </Space>
        </Space>
    </div>
  );
}
