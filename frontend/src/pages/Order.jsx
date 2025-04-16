import React, { useState, useEffect, useContext } from "react";
import { List, message, Tabs, Select, Input, Button, Pagination, Typography, Space, Tag, Spin, Empty, Card } from "antd";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ShippingStatus from "../components/ShippingStatus";

const { Option } = Select;
const { Title, Text } = Typography;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [sort, setSort] = useState("date-desc");
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      message.error("Please log in to view your orders!");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [isLoggedIn, navigate, currentPage, searchTerm, statusFilter, paymentStatusFilter, paymentMethodFilter, sort]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        status: statusFilter || (activeTab !== "all" ? activeTab : ""),
        paymentStatus: paymentStatusFilter,
        paymentMethod: paymentMethodFilter,
        sort: sort,
      };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
      setTotal(response.data.total || 0);
    } catch (err) {
      message.error("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPaymentStatusFilter("");
    setPaymentMethodFilter("");
    setSort("date-desc");
    setCurrentPage(1);
    setActiveTab("all");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filterStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    padding: "20px",
    background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px",
  };

  const filterItemStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: "220px",
    flex: 1,
  };

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
      <Title level={3} style={{ color: "#1a3c34", marginBottom: "24px" }}>
        Đơn Hàng Của Bạn 
      </Title>
      {loading ? (
        <Text type="secondary" style={{ display: "block", textAlign: "center", fontSize: "16px" }}>
          Đang tải...
        </Text>
      ) : orders.length === 0 ? (
        <Empty
          description={
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Bạn chưa có đơn hàng nào.
            </Text>
          }
        />
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"; // Updated to match ProductDetail.jsx
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
            >
              <Card
                style={{
                  borderRadius: "12px",
                  background: "#FFFFFF", // Keeping white for contrast
                  padding: "20px",
                }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong style={{ color: "#2E7D32", fontSize: "16px" }}>
                    Mã Đơn Hàng: {order._id}
                  </Text>
                  <Text style={{ fontSize: "16px", color: "#e91e63", fontWeight: "bold" }}>
                    Tổng: {order.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                  </Text>
                  <Text style={{ color: "#616161" }}>
                    Trạng Thái: {order.status}
                  </Text>
                  <Text style={{ color: "#616161" }}>
                    Sản Phẩm: {order.items.map((item) => item.productId?.name || "Unknown Product").join(", ")}
                  </Text>
                  <Text style={{ color: "#616161" }}>
                    Đơn hàng đặt vào{" "}
                    {new Date(order.createdAt).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text style={{ color: "#616161" }}>
                    Phương thức thanh toán: {order.paymentMethod}
                  </Text>
                </Space>
              </Card>
            </div>
          ))}
        </Space>
      )}
    </div>
  );
}