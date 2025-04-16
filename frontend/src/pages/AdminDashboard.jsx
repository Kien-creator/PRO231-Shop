import React, { useState, useEffect, useContext } from "react";
import {
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
  Descriptions,
  Collapse,
  Pagination,
  Layout,
  Menu,
  Typography,
  Space,
  Tag,
  DatePicker,
  Table,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  CommentOutlined,
  TruckOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Sider, Header, Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const TabContent = ({ data, renderItem, loading, total, currentPage, pageSize, onPageChange }) => (
  <div style={{ padding: "20px 0" }}>
    {loading ? (
      <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
        Loading...
      </Text>
    ) : (
      <>
        <List dataSource={data} renderItem={renderItem} />
        {total > pageSize && (
          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={onPageChange}
              showSizeChanger={false}
              style={{ fontSize: "16px" }}
            />
          </div>
        )}
      </>
    )}
  </div>
);

const CategoryForm = ({ form, onFinish, loading }) => (
  <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: "600px", margin: "0 auto" }}>
    <Form.Item
      name="name"
      label="Category Name"
      rules={[{ required: true, message: "Please enter the category name" }]}
    >
      <Input size="large" placeholder="Enter category name" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item name="description" label="Description">
      <Input.TextArea rows={4} size="large" placeholder="Enter category description" style={{ borderRadius: "8px" }} />
    </Form.Item>
  </Form>
);

const ProductForm = ({ form, onFinish, loading, categories }) => (
  <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: "600px", margin: "0 auto" }}>
    <Form.Item
      name="name"
      label="Product Name"
      rules={[{ required: true, message: "Please enter the product name" }]}
    >
      <Input size="large" placeholder="Enter product name" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="price"
      label="Price"
      rules={[{ required: true, message: "Please enter the product price" }]}
    >
      <InputNumber min={0} size="large" style={{ width: "100%", borderRadius: "8px" }} placeholder="Enter price" />
    </Form.Item>
    <Form.Item name="images" label="Image URL">
      <Input size="large" placeholder="Enter image URL" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="stock"
      label="Stock Quantity"
      rules={[{ required: true, message: "Please enter the stock quantity" }]}
    >
      <InputNumber min={0} size="large" style={{ width: "100%", borderRadius: "8px" }} placeholder="Enter stock quantity" />
    </Form.Item>
    <Form.Item name="description" label="Description">
      <Input.TextArea rows={4} size="large" placeholder="Enter product description" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="categoryId"
      label="Category"
      rules={[{ required: true, message: "Please select a category" }]}
    >
      <Select
        size="large"
        placeholder="Select a category"
        loading={loading}
        disabled={categories.length === 0}
        style={{ borderRadius: "8px" }}
      >
        {categories.map((category) => (
          <Option key={category._id} value={category._id}>
            {category.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  </Form>
);

const PromotionForm = ({ form, onFinish, loading }) => (
  <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: "600px", margin: "0 auto" }}>
    <Form.Item
      name="name"
      label="Promotion Name"
      rules={[{ required: true, message: "Please enter the promotion name" }]}
    >
      <Input size="large" placeholder="Enter promotion name" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="code"
      label="Promotion Code"
      rules={[{ required: true, message: "Please enter the promotion code" }]}
    >
      <Input size="large" placeholder="Enter promotion code" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="discount"
      label="Discount"
      rules={[{ required: true, message: "Please enter the discount value" }]}
    >
      <InputNumber min={0} size="large" style={{ width: "100%", borderRadius: "8px" }} placeholder="Enter discount" />
    </Form.Item>
    <Form.Item
      name="type"
      label="Discount Type"
      rules={[{ required: true, message: "Please select a discount type" }]}
    >
      <Select size="large" placeholder="Select discount type" style={{ borderRadius: "8px" }}>
        <Option value="percentage">Percentage</Option>
        <Option value="fixed">Fixed</Option>
      </Select>
    </Form.Item>
    <Form.Item
      name="startDate"
      label="Start Date"
      rules={[{ required: true, message: "Please select a start date" }]}
    >
      <DatePicker size="large" style={{ width: "100%", borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="endDate"
      label="End Date"
      rules={[{ required: true, message: "Please select an end date" }]}
    >
      <DatePicker size="large" style={{ width: "100%", borderRadius: "8px" }} />
    </Form.Item>
  </Form>
);

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [shippings, setShippings] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: "", data: null });
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [promotionForm] = Form.useForm();
  const [currentMenu, setCurrentMenu] = useState("add-category");
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [formProduct] = Form.useForm();

  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPageSize] = useState(10);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [orderPaymentStatusFilter, setOrderPaymentStatusFilter] = useState("");
  const [orderPaymentMethodFilter, setOrderPaymentMethodFilter] = useState("");
  const [orderSort, setOrderSort] = useState("date-desc");

  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersPageSize] = useState(10);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userSort, setUserSort] = useState("date-desc");

  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsPageSize] = useState(10);

  const [shippingsTotal, setShippingsTotal] = useState(0);
  const [shippingsPage, setShippingsPage] = useState(1);
  const [shippingsPageSize] = useState(10);

  const [promotionsTotal, setPromotionsTotal] = useState(0);
  const [promotionsPage, setPromotionsPage] = useState(1);
  const [promotionsPageSize] = useState(10);

  const { isLoggedIn, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(response.data);
    } catch (err) {
      message.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (err) {
      message.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: ordersPage,
        limit: ordersPageSize,
        search: orderSearch,
        status: orderStatusFilter,
        paymentStatus: orderPaymentStatusFilter,
        paymentMethod: orderPaymentMethodFilter,
        sort: orderSort,
      };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setOrders(response.data.orders || []);
      setOrdersTotal(response.data.total || 0);
    } catch (err) {
      message.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: usersPage,
        limit: usersPageSize,
        search: userSearch,
        role: userRoleFilter,
        sort: userSort,
      };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setUsers(response.data.users || []);
      setUsersTotal(response.data.total || 0);
    } catch (err) {
      message.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = { page: reviewsPage, limit: reviewsPageSize };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setReviews(response.data.reviews || []);
      setReviewsTotal(response.data.total || 0);
    } catch (err) {
      message.error("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const fetchShippings = async () => {
    setLoading(true);
    try {
      const params = { page: shippingsPage, limit: shippingsPageSize };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/shippings`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setShippings(response.data.shippings || []);
      setShippingsTotal(response.data.total || 0);
    } catch (err) {
      message.error("Failed to load shippings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const params = { page: promotionsPage, limit: promotionsPageSize };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/promotions`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setPromotions(response.data.promotions || []);
      setPromotionsTotal(response.data.total || 0);
    } catch (err) {
      message.error("Failed to load promotions.");
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

  const addCategory = (values) => {
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/categories`,
      "post",
      values,
      (data) => {
        setCategories([...categories, data.category]);
        categoryForm.resetFields();
      }
    );
  };

  const addProduct = (values) => {
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/products`,
      "post",
      values,
      (data) => {
        setProducts([...products, data.product]);
        form.resetFields();
      }
    );
  };

  const updateProduct = (id, values) => {
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/products/${id}`,
      "put",
      values,
      (data) => setProducts(products.map((p) => (p._id === id ? data.product : p)))
    );
  };

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
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`,
      "put",
      { status },
      (data) => {
        setOrders(orders.map((o) => (o._id === orderId ? data.order : o)));
        fetchShippings();
      }
    );
  };

  const updateOrderPaymentStatus = (orderId, paymentStatus) => {
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/payment-status`,
      "put",
      { paymentStatus },
      (data) => {
        setOrders(orders.map((o) => (o._id === orderId ? data.order : o)));
        fetchShippings(); // Refetch shippings
      }
    );
  };

  const deleteReview = (id) =>
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/reviews/${id}`,
      "delete",
      null,
      () => setReviews(reviews.filter((r) => r._id !== id))
    );

  const updateShipping = (id, values) => {
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/shippings/${id}`,
      "put",
      values,
      (data) => {
        setShippings(shippings.map((s) => (s._id === id ? data.shipping : s)));
        fetchOrders(); // Refetch orders to sync status
      }
    );
  };

  const addPromotion = (values) => {
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/promotions`,
      "post",
      { ...values, startDate: values.startDate.toISOString(), endDate: values.endDate.toISOString() },
      (data) => {
        setPromotions([...promotions, data.promotion]);
        promotionForm.resetFields();
      }
    );
  };

  const deletePromotion = (id) =>
    handleAction(
      `${import.meta.env.VITE_API_URL}/api/admin/promotions/${id}`,
      "delete",
      null,
      () => setPromotions(promotions.filter((p) => p._id !== id))
    );

  const handleClearOrderFilters = () => {
    setOrderSearch("");
    setOrderStatusFilter("");
    setOrderPaymentStatusFilter("");
    setOrderPaymentMethodFilter("");
    setOrderSort("date-desc");
    setOrdersPage(1);
  };

  const handleClearUserFilters = () => {
    setUserSearch("");
    setUserRoleFilter("");
    setUserSort("date-desc");
    setUsersPage(1);
  };

  const filterStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
  };

  useEffect(() => {
    if (!isLoggedIn || role !== "admin") {
      message.error("Only admins can access this page!");
      navigate("/login");
    } else {
      fetchProducts();
      fetchOrders();
      fetchUsers();
      fetchCategories();
      fetchReviews();
      fetchShippings();
      fetchPromotions();
    }
  }, [
    ordersPage,
    orderSearch,
    orderStatusFilter,
    orderPaymentStatusFilter,
    orderPaymentMethodFilter,
    orderSort,
    usersPage,
    userSearch,
    userRoleFilter,
    userSort,
    reviewsPage,
    shippingsPage,
    promotionsPage,
  ]);

  const menuItems = [
    {
      key: "add-category",
      icon: <PlusOutlined />,
      label: "Add Category",
    },
    {
      key: "add-product",
      icon: <PlusOutlined />,
      label: "Add Product",
    },
    {
      key: "manage-products",
      icon: <EditOutlined />,
      label: "Manage Products",
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: "Orders",
    },
    {
      key: "manage-users",
      icon: <UserOutlined />,
      label: "Manage Users",
    },
    {
      key: "manage-reviews",
      icon: <CommentOutlined />,
      label: "Manage Reviews",
    },
    {
      key: "manage-shipping",
      icon: <TruckOutlined />,
      label: "Manage Shipping",
    },
    {
      key: "add-promotion",
      icon: <PlusOutlined />,
      label: "Add Promotion",
    },
    {
      key: "manage-promotions",
      icon: <GiftOutlined />,
      label: "Manage Promotions",
    },
  ];

  const renderContent = () => {
    switch (currentMenu) {
      case "add-category":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Add New Category
            </Title>
            <CategoryForm form={categoryForm} onFinish={addCategory} loading={actionLoading} />
            <Button
              type="primary"
              onClick={() => categoryForm.submit()}
              loading={actionLoading}
              size="large"
              icon={<PlusOutlined />}
              style={{
                background: "#1a3c34",
                borderColor: "#1a3c34",
                borderRadius: "8px",
                padding: "0 24px",
                height: "48px",
                fontSize: "16px",
                marginTop: "10px",
                transition: "all 0.3s",
              }}
            >
              Save Category
            </Button>
          </div>
        );
      case "add-product":
        return (
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "30px",
              background: "#F9FAFB",
              borderRadius: "16px",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Title level={3} style={{ color: "#1A202C", marginBottom: "24px" }}>
              Bảng Điều Khiển Quản Trị
            </Title>
            <Button
              type="primary"
              onClick={() => setIsProductModalVisible(true)}
              style={{
                marginBottom: "16px",
                background: "#38A169",
                borderColor: "#38A169",
                borderRadius: "12px",
                padding: "10px 20px",
                fontSize: "16px",
                transition: "transform 0.3s ease, background 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Thêm Sản Phẩm
            </Button>
            <Table
              columns={[
                { title: "Tên Sản Phẩm", dataIndex: "name", key: "name" },
                { title: "Giá", dataIndex: "price", key: "price" },
                { title: "Số Lượng", dataIndex: "stock", key: "stock" },
              ]}
              dataSource={products}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              style={{
                background: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                overflow: "hidden",
              }}
            />
            <Modal
              title="Thêm Sản Phẩm"
              open={isProductModalVisible}
              onCancel={() => {
                setIsProductModalVisible(false);
                formProduct.resetFields();
              }}
              footer={null}
              style={{
                borderRadius: "16px",
                padding: "20px",
              }}
              bodyStyle={{
                background: "#F7FAFC",
                borderRadius: "12px",
              }}
            >
              <Form form={formProduct} onFinish={addProduct} layout="vertical">
                <Form.Item
                  label="Tên Sản Phẩm"
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                >
                  <Input
                    placeholder="Nhập tên sản phẩm"
                    style={{
                      borderRadius: "8px",
                      padding: "10px",
                    }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: "100%",
                      background: "#38A169",
                      borderColor: "#38A169",
                      borderRadius: "12px",
                      padding: "10px 20px",
                      fontSize: "16px",
                      transition: "transform 0.3s ease, background 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Thêm Sản Phẩm
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        );
      case "manage-products":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Manage Products
            </Title>
            <TabContent
              data={products}
              loading={loading}
              renderItem={(product) => (
                <List.Item
                  style={{
                    background: "#fafafa",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "12px",
                    transition: "all 0.3s",
                  }}
                  actions={[
                    <Button
                      onClick={() => removeProduct(product._id)}
                      loading={actionLoading}
                      danger
                      icon={<DeleteOutlined />}
                      style={{
                        borderRadius: "8px",
                        fontSize: "14px",
                        height: "40px",
                        transition: "all 0.3s",
                      }}
                    >
                      Delete
                    </Button>,
                    <Button
                      onClick={() => {
                        setModal({ visible: true, type: "product", data: product });
                        form.setFieldsValue({
                          name: product.name,
                          price: product.price,
                          images: product.images?.[0] || "",
                          stock: product.stock,
                          description: product.description,
                          categoryId: product.categoryId?._id || product.categoryId,
                        });
                      }}
                      disabled={actionLoading}
                      icon={<EditOutlined />}
                      style={{
                        background: "#1a3c34",
                        borderColor: "#1a3c34",
                        color: "#fff",
                        borderRadius: "8px",
                        fontSize: "14px",
                        height: "40px",
                        transition: "all 0.3s",
                      }}
                    >
                      Update
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Text strong style={{ fontSize: "16px", color: "#1a3c34" }}>
                      {product.name}
                    </Text>
                    <Text style={{ color: "#555" }}>
                      {(product.price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                    </Text>
                    <Text style={{ color: "#888" }}>Stock: {product.stock}</Text>
                    <Text style={{ color: "#888" }}>
                      Category: {product.categoryId?.name || "No Category"}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        );
      case "orders":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Manage Orders
            </Title>
            <div style={filterStyle}>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Search Order Code</Text>
                <Input
                  placeholder="Enter order code"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  allowClear
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Order Status</Text>
                <Select
                  value={orderStatusFilter}
                  onChange={(value) => setOrderStatusFilter(value)}
                  placeholder="Select status"
                  size="large"
                  style={{ borderRadius: "8px" }}
                  allowClear
                >
                  <Option value="pending">Pending</Option>
                  <Option value="processing">Processing</Option>
                  <Option value="shipped">Shipped</Option>
                  <Option value="delivered">Delivered</Option>
                  <Option value="canceled">Canceled</Option>
                </Select>
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Payment Status</Text>
                <Select
                  value={orderPaymentStatusFilter}
                  onChange={(value) => setOrderPaymentStatusFilter(value)}
                  placeholder="Select payment status"
                  size="large"
                  style={{ borderRadius: "8px" }}
                  allowClear
                >
                  <Option value="Chưa thanh toán">Not Paid</Option>
                  <Option value="Đã thanh toán">Paid</Option>
                  <Option value="Thất bại">Failed</Option>
                </Select>
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Payment Method</Text>
                <Select
                  value={orderPaymentMethodFilter}
                  onChange={(value) => setOrderPaymentMethodFilter(value)}
                  placeholder="Select method"
                  size="large"
                  style={{ borderRadius: "8px" }}
                  allowClear
                >
                  <Option value="Chuyển khoản">Bank Transfer</Option>
                  <Option value="MoMo">MoMo</Option>
                  <Option value="COD">COD</Option>
                </Select>
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Sort By</Text>
                <Select
                  value={orderSort}
                  onChange={(value) => setOrderSort(value)}
                  placeholder="Sort by"
                  size="large"
                  style={{ borderRadius: "8px" }}
                >
                  <Option value="date-desc">Date: Newest</Option>
                  <Option value="date-asc">Date: Oldest</Option>
                </Select>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <Button
                  onClick={handleClearOrderFilters}
                  size="large"
                  style={{ borderRadius: "8px", height: "40px", fontSize: "14px" }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
            <TabContent
              data={orders}
              loading={loading}
              total={ordersTotal}
              currentPage={ordersPage}
              pageSize={ordersPageSize}
              onPageChange={(page) => setOrdersPage(page)}
              renderItem={(order) => (
                <List.Item style={{ marginBottom: "20px" }}>
                  <Card
                    title={
                      <Space>
                        <Text strong style={{ color: "#1a3c34", fontSize: "16px" }}>
                          Order by {order.userId?.username || "Unknown User"}
                        </Text>
                        <Text style={{ color: "#888" }}>({order.userId?.email || "No email"})</Text>
                      </Space>
                    }
                    bordered={false}
                    style={{
                      borderRadius: "12px",
                      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
                      background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
                    }}
                    extra={
                      <Space>
                        <Select
                          value={order.status}
                          onChange={(value) => updateOrderStatus(order._id, value)}
                          style={{ width: "150px", borderRadius: "8px" }}
                          disabled={actionLoading}
                          loading={actionLoading}
                          size="large"
                        >
                          <Option value="pending">Pending</Option>
                          <Option value="processing">Processing</Option>
                          <Option value="shipped">Shipped</Option>
                          <Option value="delivered">Delivered</Option>
                          <Option value="canceled">Canceled</Option>
                        </Select>
                        <Select
                          value={order.paymentStatus}
                          onChange={(value) => updateOrderPaymentStatus(order._id, value)}
                          style={{ width: "150px", borderRadius: "8px" }}
                          disabled={actionLoading}
                          loading={actionLoading}
                          size="large"
                        >
                          <Option value="Chưa thanh toán">Not Paid</Option>
                          <Option value="Đã thanh toán">Paid</Option>
                          <Option value="Thất bại">Failed</Option>
                        </Select>
                      </Space>
                    }
                  >
                    <Descriptions column={2} bordered size="small" style={{ background: "#fff", borderRadius: "8px" }}>
                      <Descriptions.Item label="Order Code" span={2}>
                        <Text strong>{order.orderCode}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Order Date">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="Total">
                        <Text strong style={{ color: "#1a3c34" }}>
                          {order.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Payment Method" span={2}>
                        {order.paymentMethod}
                      </Descriptions.Item>
                      <Descriptions.Item label="Address" span={2}>
                        {order.address
                          ? `${order.address.specificAddress}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`
                          : "No address"}
                      </Descriptions.Item>
                    </Descriptions>
                    <Collapse style={{ marginTop: "20px", borderRadius: "8px" }}>
                      <Panel header="Order Items" key="1">
                        <List
                          dataSource={order.items}
                          renderItem={(item) => (
                            <List.Item>
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
                      </Panel>
                    </Collapse>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        );
      case "manage-users":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Manage Users
            </Title>
            <div style={filterStyle}>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Search User</Text>
                <Input
                  placeholder="Enter username or email"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  allowClear
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Role</Text>
                <Select
                  value={userRoleFilter}
                  onChange={(value) => setUserRoleFilter(value)}
                  placeholder="Select role"
                  size="large"
                  style={{ borderRadius: "8px" }}
                  allowClear
                >
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Sort By</Text>
                <Select
                  value={userSort}
                  onChange={(value) => setUserSort(value)}
                  placeholder="Sort by"
                  size="large"
                  style={{ borderRadius: "8px" }}
                >
                  <Option value="date-desc">Date: Newest</Option>
                  <Option value="date-asc">Date: Oldest</Option>
                </Select>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <Button
                  onClick={handleClearUserFilters}
                  size="large"
                  style={{ borderRadius: "8px", height: "40px", fontSize: "14px" }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
            <TabContent
              data={users}
              loading={loading}
              total={usersTotal}
              currentPage={usersPage}
              pageSize={usersPageSize}
              onPageChange={(page) => setUsersPage(page)}
              renderItem={(user) => (
                <List.Item
                  style={{
                    background: "#fafafa",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "12px",
                    transition: "all 0.3s",
                  }}
                  actions={[
                    <Button
                      onClick={() => toggleAdmin(user._id)}
                      disabled={actionLoading}
                      style={{
                        background: user.role === "admin" ? "#ff4d4f" : "#1a3c34",
                        borderColor: user.role === "admin" ? "#ff4d4f" : "#1a3c34",
                        color: "#fff",
                        borderRadius: "8px",
                        fontSize: "14px",
                        height: "40px",
                        transition: "all 0.3s",
                      }}
                    >
                      {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Text strong style={{ fontSize: "16px", color: "#1a3c34" }}>
                      {user.username}
                    </Text>
                    <Text style={{ color: "#888" }}>{user.email}</Text>
                    <Text style={{ color: "#888" }}>Role: {user.role}</Text>
                    <Text style={{ color: "#888" }}>
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        );
      case "manage-reviews":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Manage Reviews
            </Title>
            <TabContent
              data={reviews}
              loading={loading}
              total={reviewsTotal}
              currentPage={reviewsPage}
              pageSize={reviewsPageSize}
              onPageChange={(page) => setReviewsPage(page)}
              renderItem={(review) => (
                <List.Item
                  style={{
                    background: "#fafafa",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "12px",
                    transition: "all 0.3s",
                  }}
                  actions={[
                    <Button
                      onClick={() => deleteReview(review._id)}
                      loading={actionLoading}
                      danger
                      icon={<DeleteOutlined />}
                      style={{
                        borderRadius: "8px",
                        fontSize: "14px",
                        height: "40px",
                        transition: "all 0.3s",
                      }}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Text strong style={{ fontSize: "16px", color: "#1a3c34" }}>
                      {review.productId?.name || "Unknown Product"}
                    </Text>
                    <Text style={{ color: "#888" }}>
                      By {review.userId?.username || "Anonymous"}
                    </Text>
                    <Rate disabled value={review.rating} style={{ fontSize: "16px" }} />
                    {review.comment && <Text style={{ color: "#555" }}>{review.comment}</Text>}
                    <Text style={{ color: "#888" }}>
                      Posted: {new Date(review.createdAt).toLocaleDateString()}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        );
      case "manage-shipping":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Manage Shipping
            </Title>
            <TabContent
              data={shippings}
              loading={loading}
              total={shippingsTotal}
              currentPage={shippingsPage}
              pageSize={shippingsPageSize}
              onPageChange={(page) => setShippingsPage(page)}
              renderItem={(shipping) => (
                <List.Item
                  style={{
                    background: "#fafafa",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "12px",
                    transition: "all 0.3s",
                  }}
                  actions={[
                    <Button
                      onClick={() => {
                        setModal({ visible: true, type: "shipping", data: shipping });
                        form.setFieldsValue({
                          status: shipping.status,
                          estimatedDelivery: shipping.estimatedDelivery
                            ? dayjs(shipping.estimatedDelivery)
                            : null,
                        });
                      }}
                      disabled={actionLoading}
                      icon={<EditOutlined />}
                      style={{
                        background: "#1a3c34",
                        borderColor: "#1a3c34",
                        color: "#fff",
                        borderRadius: "8px",
                        fontSize: "14px",
                        height: "40px",
                        transition: "all 0.3s",
                      }}
                    >
                      Update
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Text strong style={{ fontSize: "16px", color: "#1a3c34" }}>
                      Order: {shipping.orderId?.orderCode || "Unknown Order"}
                    </Text>
                    <Text style={{ color: "#888" }}>Status: {shipping.status}</Text>
                    <Text style={{ color: "#888" }}>
                      Estimated Delivery:{" "}
                      {shipping.estimatedDelivery
                        ? new Date(shipping.estimatedDelivery).toLocaleDateString()
                        : "Not set"}
                    </Text>
                    <Text style={{ color: "#888" }}>
                      Last Updated: {new Date(shipping.updatedAt).toLocaleDateString()}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        );
      case "add-promotion":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Add New Promotion
            </Title>
            <PromotionForm form={promotionForm} onFinish={addPromotion} loading={actionLoading} />
            <Button
              type="primary"
              onClick={() => promotionForm.submit()}
              loading={actionLoading}
              size="large"
              icon={<PlusOutlined />}
              style={{
                background: "#1a3c34",
                borderColor: "#1a3c34",
                borderRadius: "8px",
                padding: "0 24px",
                height: "48px",
                fontSize: "16px",
                marginTop: "10px",
                transition: "all 0.3s",
              }}
            >
              Save Promotion
            </Button>
          </div>
        );
      case "manage-promotions":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Manage Promotions
            </Title>
            <TabContent
              data={promotions}
              loading={loading}
              total={promotionsTotal}
              currentPage={promotionsPage}
              pageSize={promotionsPageSize}
              onPageChange={(page) => setPromotionsPage(page)}
              renderItem={(promotion) => (
                <List.Item
                  style={{
                    background: "#fafafa",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "12px",
                    transition: "all 0.3s",
                  }}
                  actions={[
                    <Button
                      onClick={() => deletePromotion(promotion._id)}
                      loading={actionLoading}
                      danger
                      icon={<DeleteOutlined />}
                      style={{
                        borderRadius: "8px",
                        fontSize: "14px",
                        height: "40px",
                        transition: "all 0.3s",
                      }}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Text strong style={{ fontSize: "16px", color: "#1a3c34" }}>
                      {promotion.name}
                    </Text>
                    <Text style={{ color: "#888" }}>Code: {promotion.code}</Text>
                    <Text style={{ color: "#888" }}>
                      Discount: {promotion.discount} {promotion.type === "percentage" ? "%" : "VNĐ"}
                    </Text>
                    <Text style={{ color: "#888" }}>
                      Start: {new Date(promotion.startDate).toLocaleDateString()}
                    </Text>
                    <Text style={{ color: "#888" }}>
                      End: {new Date(promotion.endDate).toLocaleDateString()}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} style={{ background: "#1a3c34" }}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Admin Dashboard
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentMenu]}
          onClick={(e) => setCurrentMenu(e.key)}
          items={menuItems}
          style={{ background: "#1a3c34" }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 24px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <Title level={3} style={{ margin: 0, color: "#1a3c34" }}>
            {menuItems.find((item) => item.key === currentMenu)?.label}
          </Title>
        </Header>
        <Content style={{ margin: "24px", background: "#f0f2f5" }}>
          {renderContent()}
          <Modal
            title={modal.type === "product" ? "Update Product" : "Update Shipping"}
            open={modal.visible}
            onCancel={() => {
              setModal({ visible: false, type: "", data: null });
              form.resetFields();
            }}
            footer={null}
          >
            {modal.type === "product" ? (
              <>
                <ProductForm
                  form={form}
                  onFinish={(values) => {
                    updateProduct(modal.data._id, values);
                    setModal({ visible: false, type: "", data: null });
                  }}
                  loading={actionLoading}
                  categories={categories}
                />
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  loading={actionLoading}
                  style={{
                    background: "#1a3c34",
                    borderColor: "#1a3c34",
                    borderRadius: "8px",
                    padding: "0 24px",
                    height: "40px",
                    fontSize: "14px",
                    marginTop: "10px",
                  }}
                >
                  Update Product
                </Button>
              </>
            ) : (
              <Form
                form={form}
                onFinish={(values) => {
                  updateShipping(modal.data._id, {
                    ...values,
                    estimatedDelivery: values.estimatedDelivery?.toISOString(),
                  });
                  setModal({ visible: false, type: "", data: null });
                }}
                layout="vertical"
              >
                <Form.Item name="status" label="Shipping Status">
                  <Select style={{ borderRadius: "8px" }}>
                    <Option value="pending">Pending</Option>
                    <Option value="shipped">Shipped</Option>
                    <Option value="delivered">Delivered</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="estimatedDelivery" label="Estimated Delivery">
                  <DatePicker style={{ width: "100%", borderRadius: "8px" }} />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={actionLoading}
                  style={{
                    background: "#1a3c34",
                    borderColor: "#1a3c34",
                    borderRadius: "8px",
                    padding: "0 24px",
                    height: "40px",
                    fontSize: "14px",
                  }}
                >
                  Update Shipping
                </Button>
              </Form>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}