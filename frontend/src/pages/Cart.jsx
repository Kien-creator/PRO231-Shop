import React, { useState, useEffect } from "react";
import { useCart } from "../Contexts/CartContext";
import { Card, Typography, Space, Button, InputNumber, message, Divider, Empty, Checkbox, Modal, Form, Input, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Cart() {
  const { cart, addToCart, removeFromCart, fetchCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch cart data when the component mounts
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, []);

  // Log cart items for debugging
  useEffect(() => {
    console.log("Current cart items:", cart);
  }, [cart]);

  // Initialize selectedItems when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      const newSelectedItems = cart
        .map((item) => item.productId?._id || item._id)
        .filter(Boolean);
      setSelectedItems(newSelectedItems);
      setSelectAll(true);
    } else {
      setSelectedItems([]);
      setSelectAll(false);
    }
  }, [cart]);

  const handleQuantityChange = (product, value) => {
    if (value < 1) {
      message.error("Số lượng phải ít nhất là 1!");
      return;
    }
    if (value > product.stock) {
      message.error(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
      return;
    }
    removeFromCart(product.productId?._id || product._id);
    addToCart(product.productId || product, value);
  };

  const handleRemove = async (product) => {
    await removeFromCart(product.productId?._id || product._id);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        const newSelected = prev.filter((id) => id !== itemId);
        setSelectAll(newSelected.length === cart.length);
        return newSelected;
      } else {
        const newSelected = [...prev, itemId];
        setSelectAll(newSelected.length === cart.length);
        return newSelected;
      }
    });
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(cart.map((item) => item.productId?._id || item._id).filter(Boolean));
    } else {
      setSelectedItems([]);
    }
  };

  const calculateTotal = () => {
    return cart
      .filter((item) => selectedItems.includes(item.productId?._id || item._id))
      .reduce((total, item) => {
        const product = item.productId || item;
        return total + (product.price || 0) * item.quantity;
      }, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      message.error("Vui lòng chọn ít nhất một mục để thanh toán!");
      return;
    }
    if (!token) {
      message.error("Vui lòng đăng nhập để thanh toán!");
      navigate("/login");
      return;
    }
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setCheckoutLoading(true);
      const itemsToCheckout = cart.filter((item) =>
        selectedItems.includes(item.productId?._id || item._id)
      );
      console.log("Checkout payload:", { ...values, items: itemsToCheckout });
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/checkout`,
        { ...values, items: itemsToCheckout },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Đặt hàng thành công!");
      setIsModalVisible(false);
      form.resetFields();
      for (const item of itemsToCheckout) {
        await removeFromCart(item.productId?._id || item._id);
      }
      setSelectedItems([]);
      setSelectAll(false);
      navigate("/orders");
    } catch (err) {
      message.error(err.response?.data?.message || "Không thể đặt hàng.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px",
        background: "#E8F5E9", // Shopee light green background
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Title level={3} style={{ color: "#1a3c34" }}>
        Giỏ Hàng 🛍️
      </Title>
      {loading ? (
        <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
          Đang tải...
        </Text>
      ) : cart.length === 0 ? (
        <Empty
          description={
            <Text style={{ color: "#888" }}>Giỏ hàng của bạn trống. Hãy thêm sản phẩm!</Text>
          }
        />
      ) : (
        <>
          <Space style={{ marginBottom: "20px" }}>
            <Checkbox checked={selectAll} onChange={handleSelectAll}>
              Chọn tất cả
            </Checkbox>
          </Space>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {cart.map((item) => {
              const product = item.productId || item;
              if (!product) return null;
              console.log("Rendering item:", item); // Add this for debugging
              return (
                <Card key={item._id || product._id} style={{ borderRadius: "8px", background: "#fff" }}>
                  <Space style={{ width: "100%", alignItems: "center" }}>
                    <Checkbox
                      checked={selectedItems.includes(product._id)}
                      onChange={() => handleSelectItem(product._id)}
                    />
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name || "Sản phẩm"}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          background: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "8px",
                        }}
                      >
                        <Text type="secondary">Không có ảnh</Text>
                      </div>
                    )}
                    <Space direction="vertical" style={{ flex: 1 }}>
                      <Text strong style={{ fontSize: "16px", color: "#1a3c34" }}>
                        {product.name || "Sản phẩm không xác định"}
                      </Text>
                      <Text>
                        Giá: {(product.price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                      </Text>
                      <Space>
                        <Text>Số lượng:</Text>
                        <InputNumber
                          min={1}
                          max={product.stock || 999}
                          value={item.quantity}
                          onChange={(value) => handleQuantityChange(product, value)}
                        />
                      </Space>
                    </Space>
                    <Space direction="vertical" style={{ alignItems: "flex-end" }}>
                      <Text style={{ color: "#e91e63", fontWeight: "bold" }}>
                        Tổng: {((product.price || 0) * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                      </Text>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(product)}
                        style={{
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        Xóa
                      </Button>
                    </Space>
                  </Space>
                </Card>
              );
            })}
          </Space>
          <Divider />
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Title level={4} style={{ color: "#1a3c34" }}>
              Tổng cho các mục đã chọn: {calculateTotal().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
            </Title>
            <Button
              type="primary"
              size="large"
              style={{
                backgroundColor: "#00C853", // Shopee vibrant green
                borderColor: "#00C853",
                transition: "transform 0.3s ease",
              }}
              onClick={handleCheckout}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Tiến hành thanh toán ({selectedItems.length} mục)
            </Button>
          </Space>

          {/* Checkout Modal */}
          <Modal
            title="Thanh toán"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            okText="Đặt hàng"
            cancelText="Hủy"
            okButtonProps={{
              loading: checkoutLoading,
              style: {
                backgroundColor: "#00C853", // Shopee vibrant green
                borderColor: "#00C853",
                transition: "transform 0.3s ease",
              },
              onMouseEnter: (e) => (e.currentTarget.style.transform = "scale(1.05)"),
              onMouseLeave: (e) => (e.currentTarget.style.transform = "scale(1)"),
            }}
            cancelButtonProps={{
              style: {
                transition: "transform 0.3s ease",
              },
              onMouseEnter: (e) => (e.currentTarget.style.transform = "scale(1.05)"),
              onMouseLeave: (e) => (e.currentTarget.style.transform = "scale(1)"),
            }}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name={["address", "name"]}
                label="Tên người nhận"
                rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
              >
                <Input placeholder="Nhập tên người nhận" />
              </Form.Item>
              <Form.Item
                name={["address", "phone"]}
                label="Số điện thoại"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item
                name={["address", "city"]}
                label="Thành phố"
                rules={[{ required: true, message: "Vui lòng nhập thành phố" }]}
              >
                <Input placeholder="Nhập thành phố" />
              </Form.Item>
              <Form.Item
                name={["address", "district"]}
                label="Quận/Huyện"
                rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
              >
                <Input placeholder="Nhập quận/huyện" />
              </Form.Item>
              <Form.Item
                name={["address", "ward"]}
                label="Phường/Xã"
                rules={[{ required: true, message: "Vui lòng nhập phường/xã" }]}
              >
                <Input placeholder="Nhập phường/xã" />
              </Form.Item>
              <Form.Item
                name={["address", "specificAddress"]}
                label="Địa chỉ cụ thể"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
              >
                <Input placeholder="Nhập địa chỉ cụ thể (ví dụ: số nhà, tên đường)" />
              </Form.Item>
              <Form.Item
                name="paymentMethod"
                label="Phương thức thanh toán"
                rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
              >
                <Select placeholder="Chọn phương thức thanh toán">
                  <Option value="Chuyển khoản">Chuyển khoản</Option>
                  <Option value="MoMo">MoMo</Option>
                  <Option value="COD">COD</Option>
                </Select>
              </Form.Item>
              <Form.Item name="promotionCode" label="Mã khuyến mãi">
                <Input placeholder="Nhập mã khuyến mãi" />
              </Form.Item>
              <Text strong style={{ display: "block", marginBottom: "20px", fontSize: "16px" }}>
                Tổng: {calculateTotal().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
              </Text>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
}