import React, { useContext, useState } from "react";
import { Button } from "antd";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

export default function ProductCard({ name, price, image, productId }) {
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const addToCart = async () => {
    if (!isLoggedIn) {
      message.error("Please log in to add items to your cart!");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId, name, quantity: 1, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Item added to cart!");
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center",
    backgroundColor: "#fff",
    width: "320px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  };

  const imageStyle = {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "8px",
  };

  const nameStyle = {
    color: "#333",
    fontSize: "16px",
    fontWeight: "600",
    margin: "10px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const priceStyle = {
    fontSize: "18px",
    color: "#e74c3c",
    marginBottom: "15px",
  };

  const buttonStyle = {
    width: "100%",
    backgroundColor: "#3498db",
    border: "none",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "16px",
  };

  return (
    <div style={cardStyle}>
      <Link to={`/products/${productId}`}>
        <img src={image} alt={name} style={imageStyle} />
        <h3 style={nameStyle}>{name}</h3>
        <p style={priceStyle}>${price}</p>
      </Link>
      <Button
        type="primary"
        onClick={addToCart}
        disabled={loading}
        style={buttonStyle}
      >
        Add to Cart
      </Button>
    </div>
  );
}