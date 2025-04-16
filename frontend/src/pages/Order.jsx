import React, { useState, useEffect, useContext } from "react";
import { List, message, Tabs, Select, Input, Button, Pagination, Typography, Space, Tag, Spin } from "antd";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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
      console.log("Fetching orders with params:", params);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      console.log("Orders response:", response.data);
      setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
      setTotal(response.data.total || 0);
    } catch (err) {
      message.error("Failed to load orders. Please try again later.");
      console.error("Failed to load orders:", err.response?.data || err.message);
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

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}><Spin size="large" /></div>;

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
        Your Orders
      </Title>

      {/* Filters */}
      <div style={filterStyle}>
        <div style={filterItemStyle}>
          <Text strong style={{ color: "#1a3c34" }}>
            Search Order Code
          </Text>
          <Input
            placeholder="Enter order code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            size="large"
            style={{ borderRadius: "8px" }}
          />
        </div>
        <div style={filterItemStyle}>
          <Text strong style={{ color: "#1a3c34" }}>
            Order Status
          </Text>
          <Select
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setActiveTab("all");
            }}
            placeholder="Select status"
            style={{ width: "100%", borderRadius: "8px" }}
            allowClear
            size="large"
          >
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="canceled">Canceled</Option>
          </Select>
        </div>
        <div style={filterItemStyle}>
          <Text strong style={{ color: "#1a3c34" }}>
            Payment Status
          </Text>
          <Select
            value={paymentStatusFilter}
            onChange={(value) => setPaymentStatusFilter(value)}
            placeholder="Select payment status"
            style={{ width: "100%", borderRadius: "8px" }}
            allowClear
            size="large"
          >
            <Option value="Chưa thanh toán">Not Paid</Option>
            <Option value="Đã thanh toán">Paid</Option>
            <Option value="Thất bại">Failed</Option>
          </Select>
        </div>
        <div style={filterItemStyle}>
          <Text strong style={{ color: "#1a3c34" }}>
            Payment Method
          </Text>
          <Select
            value={paymentMethodFilter}
            onChange={(value) => setPaymentMethodFilter(value)}
            placeholder="Select method"
            style={{ width: "100%", borderRadius: "8px" }}
            allowClear
            size="large"
          >
            <Option value="Chuyển khoản">Bank Transfer</Option>
            <Option value="MoMo">MoMo</Option>
            <Option value="COD">COD</Option>
          </Select>
        </div>
        <div style={filterItemStyle}>
          <Text strong style={{ color: "#1a3c34" }}>
            Sort By
          </Text>
          <Select
            value={sort}
            onChange={(value) => setSort(value)}
            placeholder="Sort by"
            style={{ width: "100%", borderRadius: "8px" }}
            size="large"
          >
            <Option value="date-desc">Date: Newest</Option>
            <Option value="date-asc">Date: Oldest</Option>
          </Select>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <Button
            onClick={handleClearFilters}
            size="large"
            style={{ borderRadius: "8px", height: "40px", fontSize: "14px" }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          setStatusFilter("");
        }}
        items={[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "processing", label: "Processing" },
          { key: "shipped", label: "Shipped" },
          { key: "delivered", label: "Delivered" },
          { key: "canceled", label: "Canceled" },
        ]}
        style={{ marginBottom: "20px" }}
        tabBarStyle={{
          background: "#fff",
          padding: "12px 24px",
          borderRadius: "12px 12px 0 0",
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.05)",
          marginBottom: 0,
          fontSize: "16px",
        }}
        animated={{ inkBar: true, tabPane: true }}
      />

      {/* Order List */}
      {orders.length > 0 ? (
        <>
          <List
            dataSource={orders}
            renderItem={(order) => (
              <List.Item
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
                  borderRadius: "12px",
                  marginBottom: "16px",
                  padding: "16px",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s",
                }}
              >
                <div style={{ width: "100%" }}>
                  <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    <Space>
                      <Text strong style={{ color: "#1a3c34", fontSize: "16px" }}>
                        Order Code: {order.orderCode}
                      </Text>
                      <Tag
                        color={
                          order.status === "delivered"
                            ? "green"
                            : order.status === "canceled"
                            ? "red"
                            : "blue"
                        }
                        style={{ borderRadius: "12px", padding: "4px 12px", fontSize: "12px" }}
                      >
                        {order.status.toUpperCase()}
                      </Tag>
                    </Space>
                    <Text style={{ color: "#888" }}>
                      Order Date: {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                    <Text style={{ color: "#888" }}>Payment Status: {order.paymentStatus}</Text>
                    <Text style={{ color: "#888" }}>Payment Method: {order.paymentMethod}</Text>
                    <Text style={{ color: "#888" }}>
                      Address: {order.address.specificAddress}, {order.address.ward}, {order.address.district}, {order.address.city}
                    </Text>
                    <Text strong style={{ color: "#1a3c34" }}>
                      Total: {order.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                    </Text>
                    <ShippingStatus orderId={order._id} />
                    <List
                      dataSource={order.items}
                      renderItem={(item) => (
                        <List.Item style={{ padding: "8px 0" }}>
                          <Space>
                            <Text>{item.productId?.name || "Unknown Product"}</Text>
                            <Text>x {item.quantity}</Text>
                            <Text strong style={{ color: "#1a3c34" }}>
                              {(item.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                            </Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Space>
                </div>
              </List.Item>
            )}
          />
          {total > pageSize && (
            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger={false}
                style={{ fontSize: "16px" }}
              />
            </div>
          )}
        </>
      ) : (
        <Text style={{ display: "block", textAlign: "center", fontSize: "16px", color: "#888" }}>
          No orders found.
        </Text>
      )}
    </div>
  );
}