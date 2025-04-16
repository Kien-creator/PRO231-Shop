import React from "react";
import { Typography, Timeline, Space } from "antd"; // Added Space import

const { Text } = Typography;

const ShippingStatus = ({ status }) => {
  console.log("ShippingStatus rendering with status:", status); // Add for debugging

  const getStatusSteps = () => {
    switch (status) {
      case "pending":
        return [
          { title: "Order Placed", description: "Your order has been placed." },
          { title: "Processing", description: "Waiting for processing..." },
          { title: "Shipped", description: "Waiting for shipping..." },
          { title: "Delivered", description: "Waiting for delivery..." },
        ];
      case "processing":
        return [
          { title: "Order Placed", description: "Your order has been placed." },
          { title: "Processing", description: "Your order is being processed." },
          { title: "Shipped", description: "Waiting for shipping..." },
          { title: "Delivered", description: "Waiting for delivery..." },
        ];
      case "shipped":
        return [
          { title: "Order Placed", description: "Your order has been placed." },
          { title: "Processing", description: "Your order has been processed." },
          { title: "Shipped", description: "Your order has been shipped." },
          { title: "Delivered", description: "Waiting for delivery..." },
        ];
      case "delivered":
        return [
          { title: "Order Placed", description: "Your order has been placed." },
          { title: "Processing", description: "Your order has been processed." },
          { title: "Shipped", description: "Your order has been shipped." },
          { title: "Delivered", description: "Your order has been delivered." },
        ];
      default:
        return [];
    }
  };

  const steps = getStatusSteps();

  return (
    <Timeline>
      {steps.map((step, index) => (
        <Timeline.Item key={index}>
          <Space direction="vertical">
            <Text strong>{step.title}</Text>
            <Text>{step.description}</Text>
          </Space>
        </Timeline.Item>
      ))}
    </Timeline>
  );
};

export default ShippingStatus;