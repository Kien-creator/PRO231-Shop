import React from "react";
import { Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

export default function HeroSection() {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #E8F5E9, #ffffff)", 
        padding: "60px 24px",
        textAlign: "center",
        borderRadius: "12px",
        margin: "24px",
      }}
    >
      <Title
        style={{
          color: "#333",
          fontSize: "48px",
          marginBottom: "16px",
        }}
      >
        Chào mừng đến Fake Shop!
      </Title>
      <Text
        style={{
          color: "#333",
          fontSize: "20px",
          display: "block",
          marginBottom: "24px",
        }}
      >
        Nơi bán hàng chất lượng cao
      </Text>
      <Link to="/shop">
        <Button
          type="primary"
          size="large"
          style={{
            background: "#1a3c34", 
            borderColor: "#1a3c34",
            borderRadius: "8px",
            padding: "0 32px",
            height: "48px",
            fontSize: "16px",
          }}
        >
          Mua ngay
        </Button>
      </Link>
    </div>
  );
}