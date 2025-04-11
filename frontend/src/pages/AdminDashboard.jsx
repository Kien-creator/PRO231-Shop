import React, { useState, useEffect, useContext } from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  List,
  message,
  Card,
  Modal,
  InputNumber,
  Select,
  Rate,
  DatePicker,
  Descriptions,
  Collapse,
} from "antd";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

const TabContent = ({ data, renderItem, loading }) => (
  <div>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <List dataSource={data} renderItem={renderItem} />
    )}
  </div>
);

const ProductForm = ({ form, onFinish, loading }) => (
  <Form form={form} onFinish={onFinish} layout="vertical">
    <Form.Item
      name="name"
      label="Name"
      rules={[{ required: true, message: "Please enter the product name" }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="price"
      label="Price"
      rules={[{ required: true, message: "Please enter the price" }]}
    >
      <InputNumber min={0} style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item name="image" label="Image URL">
      <Input />
    </Form.Item>
    <Form.Item
      name="quantityLeft"
      label="Quantity Left"
      rules={[{ required: true, message: "Please enter the quantity" }]}
    >
      <InputNumber min={0} style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item
      name="description"
      label="Description"
      rules={[{ required: false }]} 
    >
      <Input.TextArea rows={4} placeholder="Enter product description" />
    </Form.Item>
  </Form>
);

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, product: null });
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const { isLoggedIn, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isLoggedIn || role !== "admin") {
      message.error("Admin access only!");
      navigate("/login");
    } else {
      fetchData();
    }
  }, [isLoggedIn, role, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/products`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      message.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (url, method, data, updateState) => {
    setActionLoading(true);
    try {
      const response = await axios({
        url,
        method,
        data,
        headers: { Authorization: `Bearer ${token}` },
      });
      updateState(response.data);
      message.success(response.data.message || "Action successful!");
    } catch (err) {
      message.error(err.response?.data?.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const addProduct = (values) =>
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/products`,
      "post",
      values,
      (data) => {
        setProducts([...products, data]);
        form.resetFields();
      }
    );

  const updateProduct = (id, values) =>
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/products/${id}`,
      "put",
      values,
      (data) => setProducts(products.map((p) => (p._id === id ? data : p)))
    );

  const removeProduct = (id) =>
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/products/${id}`,
      "delete",
      null,
      () => setProducts(products.filter((p) => p._id !== id))
    );

  const toggleAdmin = (id) =>
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${id}/admin`,
      "put",
      null,
      (data) => setUsers(users.map((u) => (u._id === id ? data.user : u)))
    );

  const updateOrderStatus = (orderId, status) => {
    const order = orders.find((o) => o._id === orderId);
    if (order.status === "Delivered") {
      message.error("Cannot change status of a delivered order!");
      return;
    }
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`,
      "put",
      { status },
      (data) => setOrders(orders.map((o) => (o._id === orderId ? data.order : o)))
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesName = nameFilter
      ? order.userId?.username?.toLowerCase().includes(nameFilter.toLowerCase())
      : true;
    const matchesDate = dateFilter
      ? dayjs(order.createdAt).isSame(dayjs(dateFilter), "day")
      : true;
    return matchesName && matchesDate;
  });

  const tabItems = [
    {
      key: "1",
      label: "Add Product",
      children: (
        <ProductForm form={form} onFinish={addProduct} loading={actionLoading} />
      ),
    },
    {
      key: "2",
      label: "Manage Products",
      children: (
        <>
          <TabContent
            data={products}
            loading={loading}
            renderItem={(product) => (
              <List.Item
                actions={[
                  <Button
                    onClick={() => removeProduct(product._id)}
                    loading={actionLoading}
                  >
                    Remove
                  </Button>,
                  <Button
                    onClick={() => {
                      setModal({ visible: true, product });
                      form.setFieldsValue(product);
                    }}
                    disabled={actionLoading}
                  >
                    Update
                  </Button>,
                ]}
              >
                <div>
                  <strong>{product.name}</strong> - ${product.price}
                  <div style={{ marginTop: "10px" }}>
                    <strong>Average Rating: </strong>
                    <Rate
                      allowHalf
                      disabled
                      value={product.rating}
                    />
                    <span> ({product.rating.toFixed(1)}/5 from {product.ratings.length} users)</span>
                  </div>
                </div>
              </List.Item>
            )}
          />
          <Modal
            title="Update Product"
            open={modal.visible}
            onOk={() => {
              form.validateFields().then((values) => {
                updateProduct(modal.product._id, values);
                setModal({ visible: false, product: null });
              });
            }}
            onCancel={() => setModal({ visible: false, product: null })}
            okButtonProps={{ loading: actionLoading }}
          >
            <ProductForm form={form} onFinish={() => {}} loading={actionLoading} />
          </Modal>
        </>
      ),
    },
    {
      key: "3",
      label: "Orders",
      children: (
        <>
          {/* Filters */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "15px", alignItems: "center" }}>
            <Input
              placeholder="Filter by username"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              style={{ width: "250px" }}
              allowClear
            />
            <DatePicker
              placeholder="Filter by date"
              value={dateFilter}
              onChange={(date) => setDateFilter(date)}
              style={{ width: "200px" }}
            />
            <Button
              type="default"
              onClick={() => {
                setNameFilter("");
                setDateFilter(null);
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Orders List */}
          <TabContent
            data={filteredOrders}
            loading={loading}
            renderItem={(order) => (
              <List.Item style={{ marginBottom: "20px" }}>
                <Card
                  title={
                    <span>
                      Order by <strong>{order.userId?.username || "Unknown User"}</strong> ({order.userId?.email || "No email"})
                    </span>
                  }
                  bordered
                  style={{ width: "100%", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                  extra={
                    <Select
                      value={order.status}
                      onChange={(value) => updateOrderStatus(order._id, value)}
                      style={{ width: "150px" }}
                      disabled={actionLoading || order.status === "Delivered"}
                      loading={actionLoading}
                    >
                      <Option value="Pending">Pending</Option>
                      <Option value="On Delivery">On Delivery</Option>
                      <Option value="Delivered">Delivered</Option>
                      <Option value="Cancelled">Cancelled</Option>
                    </Select>
                  }
                >
                  <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Order ID">{order._id}</Descriptions.Item>
                    <Descriptions.Item label="Placed On">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total">
                      <strong>${order.total}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <span
                        style={{
                          color:
                            order.status === "Delivered"
                              ? "green"
                              : order.status === "Cancelled"
                              ? "red"
                              : "blue",
                        }}
                      >
                        {order.status}
                      </span>
                    </Descriptions.Item>
                  </Descriptions>

                  {/* Expandable Items */}
                  <div style={{ marginTop: "15px" }}>
                    <Collapse
                      items={[
                        {
                          key: "1",
                          label: `Items (${order.items.length})`,
                          children: (
                            <List
                              dataSource={order.items}
                              renderItem={(item) => (
                                <List.Item>
                                  <span>
                                    {item.productId?.name || "Unknown Product"} x {item.quantity} - $
                                    {(item.productId?.price || 0) * item.quantity}
                                  </span>
                                </List.Item>
                              )}
                            />
                          ),
                        },
                      ]}
                    />
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </>
      ),
    },
    {
      key: "4",
      label: "Manage Users",
      children: (
        <TabContent
          data={users}
          loading={loading}
          renderItem={(user) => (
            <List.Item
              actions={[
                <Button
                  onClick={() => toggleAdmin(user._id)}
                  loading={actionLoading}
                  disabled={actionLoading}
                >
                  {user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                </Button>,
              ]}
            >
              {user.username} ({user.email}) - {user.role === "admin" ? "Admin" : "User"}
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Dashboard</h2>
      </div>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
}