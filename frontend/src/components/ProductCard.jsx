// src/components/ProductCard.jsx
import React from "react";
import { Card, Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;

export default function ProductCard({ productId, name, price, image }) {
  return (
    <Card
      hoverable
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
        },
      }}
      cover={
        image ? (
          <div
            style={{
              position: "relative",
              height: "200px",
              background: `url(${image}) center/cover no-repeat`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              height: "200px",
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text type="secondary">No Image</Text>
          </div>
        )
      }
    >
      <Card.Meta
        title={<Text strong style={{ fontSize: "18px", color: "#1a3c34" }}>{name}</Text>}
        description={<Text style={{ fontSize: "16px", color: "#555" }}>${price}</Text>}
      />
      <Link to={`/product/${productId}`}>
        <Button
          type="primary"
          style={{
            marginTop: "16px",
            width: "100%",
            height: "40px",
            fontSize: "14px",
            background: "#1a3c34",
            borderColor: "#1a3c34",
            borderRadius: "8px",
            transition: "all 0.3s",
          }}
        >
          View Details
        </Button>
      </Link>
    </Card>
  );
}