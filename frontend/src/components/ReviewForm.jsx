import React from "react";
import { Form, Input, Button, Rate, message } from "antd";
import axios from "axios";

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");

  const onFinish = async (values) => {
    if (!token) {
      message.error("Please log in to submit a review!");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}/reviews`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Review submitted successfully!");
      form.resetFields();
      onReviewSubmitted(response.data.review);
    } catch (err) {
      message.error("Failed to submit review.");
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ marginTop: "20px", maxWidth: "600px" }}
    >
      <Form.Item
        name="rating"
        label="Rating"
        rules={[{ required: true, message: "Please provide a rating" }]}
      >
        <Rate />
      </Form.Item>
      <Form.Item name="comment" label="Comment">
        <Input.TextArea rows={4} placeholder="Write your review" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            background: "#1a3c34",
            borderColor: "#1a3c34",
            borderRadius: "8px",
            height: "40px",
          }}
        >
          Submit Review
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReviewForm;