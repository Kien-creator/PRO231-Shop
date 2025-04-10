import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Input, Rate, List, message } from "antd";
import { AuthContext } from "../Contexts/AuthContext";

const { TextArea } = Input;

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comment, setComment] = useState("");
  const { isLoggedIn } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        message.error("Failed to load product details.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      message.error("Please log in to add a comment!");
      navigate("/login");
      return;
    }
    if (!comment) {
      message.error("Please enter a comment!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${id}/comment`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );
      setProduct(response.data);
      setComment("");
      message.success("Comment added!");
    } catch (error) {
      message.error("Failed to add comment.");
    }
  };

  const handleRateProduct = async (value) => {
    if (!isLoggedIn) {
      message.error("Please log in to rate this product!");
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${id}/rate`,
        { rating: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );
      setProduct({ ...response.data });
      message.success("Rating submitted!");
    } catch (error) {
      message.error("Failed to submit rating.");
    }
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "300px",
            height: "300px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        <div>
          <h1>{product.name}</h1>
          <p style={{ fontSize: "18px", color: "#ff6200" }}>${product.price}</p>
          <p>
            <strong>Description:</strong>{" "}
            {product.description || "No description available."}
          </p>
          <div style={{ marginBottom: "10px" }}>
            <strong>Rate this product: </strong>
            <Rate
              key={product.rating}
              allowHalf
              value={product.rating}
              onChange={handleRateProduct}
            />
            <span>
              {" "}
              ({product.rating.toFixed(1)}/5 from {product.ratings.length}{" "}
              users)
            </span>
          </div>
          <p>
            <strong>Sold:</strong> {product.sold} items
          </p>
          <p>
            <strong>Quantity Left:</strong> {product.quantityLeft}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Comments</h2>
        {product.comments.length > 0 ? (
          <List
            dataSource={product.comments}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <strong>{item.username}</strong> (
                  {new Date(item.createdAt).toLocaleDateString()}):{" "}
                  {item.comment}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <p>No comments yet.</p>
        )}

        <div style={{ marginTop: "20px" }}>
          <TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            style={{ marginBottom: "10px" }}
          />
          <Button type="primary" onClick={handleAddComment}>
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
