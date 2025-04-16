import React, { useState, useEffect } from "react";
import { List, Typography, Spin, Button, Space } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/promotions`);
      setPromotions(response.data.promotions);
    } catch (err) {
      console.error("Failed to load promotions.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromotion = (code) => {
    console.log(`Applying promotion code: ${code}`);
    // Integrate this with your cart or checkout logic
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Title level={3} style={{ color: "#1a3c34", marginBottom: "24px" }}>
        Available Promotions
      </Title>
      {promotions.length > 0 ? (
        <List
          dataSource={promotions}
          renderItem={(promotion) => (
            <List.Item
              style={{
                background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
                borderRadius: "12px",
                marginBottom: "16px",
                padding: "16px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text strong style={{ color: "#1a3c34", fontSize: "16px" }}>
                  {promotion.name}
                </Text>
                <Text>Code: {promotion.code}</Text>
                <Text>
                  Discount: {promotion.type === "percentage" ? `${promotion.discount}%` : `$${promotion.discount}`}
                </Text>
                <Text>
                  Valid: {new Date(promotion.startDate).toLocaleDateString()} -{" "}
                  {new Date(promotion.endDate).toLocaleDateString()}
                </Text>
                <Button
                  type="primary"
                  style={{
                    background: "#00C853",
                    borderColor: "#00C853",
                    borderRadius: "8px",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={() => handleApplyPromotion(promotion.code)}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Apply Now
                </Button>
              </Space>
            </List.Item>
          )}
        />
      ) : (
        <Text style={{ display: "block", textAlign: "center", fontSize: "16px", color: "#888" }}>
          No promotions available.
        </Text>
      )}
    </div>
  );
}