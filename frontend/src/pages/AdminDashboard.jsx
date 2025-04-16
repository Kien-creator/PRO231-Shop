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
  HomeOutlined,
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
        Đang tải...
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
      label="Tên Danh Mục"
      rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
    >
      <Input size="large" placeholder="Nhập tên danh mục" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item name="description" label="Mô Tả">
      <Input.TextArea rows={4} size="large" placeholder="Nhập mô tả danh mục" style={{ borderRadius: "8px" }} />
    </Form.Item>
  </Form>
);

const ProductForm = ({ form, onFinish, loading, categories }) => (
  <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: "600px", margin: "0 auto" }}>
    <Form.Item
      name="name"
      label="Tên Sản Phẩm"
      rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
    >
      <Input size="large" placeholder="Nhập tên sản phẩm" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="price"
      label="Giá"
      rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
    >
      <InputNumber min={0} size="large" style={{ width: "100%", borderRadius: "8px" }} placeholder="Nhập giá" />
    </Form.Item>
    <Form.Item name="images" label="URL Hình Ảnh">
      <Input size="large" placeholder="Nhập URL hình ảnh" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="stock"
      label="Số Lượng Tồn Kho"
      rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho!" }]}
    >
      <InputNumber min={0} size="large" style={{ width: "100%", borderRadius: "8px" }} placeholder="Nhập số lượng tồn kho" />
    </Form.Item>
    <Form.Item name="description" label="Mô Tả">
      <Input.TextArea rows={4} size="large" placeholder="Nhập mô tả sản phẩm" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="categoryId"
      label="Danh Mục"
      rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
    >
      <Select
        size="large"
        placeholder="Chọn danh mục"
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
      label="Tên Khuyến Mãi"
      rules={[{ required: true, message: "Vui lòng nhập tên khuyến mãi!" }]}
    >
      <Input size="large" placeholder="Nhập tên khuyến mãi" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="code"
      label="Mã Khuyến Mãi"
      rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi!" }]}
    >
      <Input size="large" placeholder="Nhập mã khuyến mãi" style={{ borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="discount"
      label="Giảm Giá"
      rules={[{ required: true, message: "Vui lòng nhập giá trị giảm giá!" }]}
    >
      <InputNumber min={0} size="large" style={{ width: "100%", borderRadius: "8px" }} placeholder="Nhập giá trị giảm giá" />
    </Form.Item>
    <Form.Item
      name="type"
      label="Loại Giảm Giá"
      rules={[{ required: true, message: "Vui lòng chọn loại giảm giá!" }]}
    >
      <Select size="large" placeholder="Chọn loại giảm giá" style={{ borderRadius: "8px" }}>
        <Option value="percentage">Phần Trăm</Option>
        <Option value="fixed">Cố Định</Option>
      </Select>
    </Form.Item>
    <Form.Item
      name="startDate"
      label="Ngày Bắt Đầu"
      rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
    >
      <DatePicker size="large" style={{ width: "100%", borderRadius: "8px" }} />
    </Form.Item>
    <Form.Item
      name="endDate"
      label="Ngày Kết Thúc"
      rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
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
      message.error("Không thể tải sản phẩm.");
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
      message.error("Không thể tải danh mục.");
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
      message.error("Không thể tải đơn hàng.");
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
      message.error("Không thể tải người dùng.");
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
      message.error("Không thể tải đánh giá.");
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
      message.error("Không thể tải thông tin giao hàng.");
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
      message.error("Không thể tải khuyến mãi.");
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
      message.success(response.data.message || "Thành công!");
    } catch (err) {
      message.error(err.response?.data?.message || "Thất bại.");
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
        fetchShippings();
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
        fetchOrders();
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
      message.error("Chỉ quản trị viên mới có thể truy cập trang này!");
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
      label: "Thêm Danh Mục",
    },
    {
      key: "add-product",
      icon: <PlusOutlined />,
      label: "Thêm Sản Phẩm",
    },
    {
      key: "manage-products",
      icon: <EditOutlined />,
      label: "Quản Lý Sản Phẩm",
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: "Đơn Hàng",
    },
    {
      key: "manage-users",
      icon: <UserOutlined />,
      label: "Quản Lý Người Dùng",
    },
    {
      key: "manage-reviews",
      icon: <CommentOutlined />,
      label: "Quản Lý Đánh Giá",
    },
    {
      key: "manage-shipping",
      icon: <TruckOutlined />,
      label: "Quản Lý Giao Hàng",
    },
    {
      key: "add-promotion",
      icon: <PlusOutlined />,
      label: "Thêm Khuyến Mãi",
    },
    {
      key: "manage-promotions",
      icon: <GiftOutlined />,
      label: "Quản Lý Khuyến Mãi",
    },
  ];

  const renderContent = () => {
    switch (currentMenu) {
      case "add-category":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Thêm Danh Mục Mới
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
              Lưu Danh Mục
            </Button>
          </div>
        );
      case "add-product":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Thêm Sản Phẩm Mới
            </Title>
            <ProductForm form={form} onFinish={addProduct} loading={actionLoading} categories={categories} />
            <Button
              type="primary"
              onClick={() => form.submit()}
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
              Lưu Sản Phẩm
            </Button>
          </div>
        );
      case "manage-products":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Quản Lý Sản Phẩm
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
                      Xóa
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
                      Cập Nhật
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
                    <Text style={{ color: "#888" }}>Tồn Kho: {product.stock}</Text>
                    <Text style={{ color: "#888" }}>
                      Danh Mục: {product.categoryId?.name || "Không Có Danh Mục"}
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
              Quản Lý Đơn Hàng
            </Title>
            <div style={filterStyle}>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Tìm Kiếm Mã Đơn Hàng</Text>
                <Input
                  placeholder="Nhập mã đơn hàng"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  allowClear
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Trạng Thái Đơn Hàng</Text>
                <Select
                  value={orderStatusFilter}
                  onChange={(value) => setOrderStatusFilter(value)}
                  placeholder="Chọn trạng thái"
                  size="large"
                  style={{ borderRadius: "8px" }}
                  allowClear
                >
                  <Option value="pending">Chờ Xử Lý</Option>
                  <Option value="processing">Đang Xử Lý</Option>
                  <Option value="shipped">Đã Gửi Hàng</Option>
                  <Option value="delivered">Đã Giao Hàng</Option>
                  <Option value="canceled">Đã Hủy</Option>
                </Select>
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Trạng Thái Thanh Toán</Text>
                <Select
                  value={orderPaymentStatusFilter}
                  onChange={(value) => setOrderPaymentStatusFilter(value)}
                  placeholder="Chọn trạng thái thanh toán"
                  size="large"
                  style={{ borderRadius: "8px" }}
                  allowClear
                >
                  <Option value="Chưa thanh toán">Chưa Thanh Toán</Option>
                  <Option value="Đã thanh toán">Đã Thanh Toán</Option>
                  <Option value="Thất bại">Thất Bại</Option>
                </Select>
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Phương Thức Thanh Toán</Text>
                <Select
                  value={orderPaymentMethodFilter}
                  onChange={(value) => setOrderPaymentMethodFilter(value)}
                  placeholder="Chọn phương thức"
                  size="large"
                  style={{ borderRadius: "8px" }}
                  allowClear
                >
                  <Option value="Chuyển khoản">Chuyển Khoản</Option>
                  <Option value="MoMo">MoMo</Option>
                  <Option value="COD">COD</Option>
                </Select>
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Sắp Xếp Theo</Text>
                <Select
                  value={orderSort}
                  onChange={(value) => setOrderSort(value)}
                  placeholder="Sắp xếp theo"
                  size="large"
                  style={{ borderRadius: "8px" }}
                >
                  <Option value="date-desc">Ngày: Mới Nhất</Option>
                  <Option value="date-asc">Ngày: Cũ Nhất</Option>
                </Select>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <Button
                  onClick={handleClearOrderFilters}
                  size="large"
                  style={{ borderRadius: "8px", height: "40px", fontSize: "14px" }}
                >
                  Xóa Bộ Lọc
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
                          Đơn Hàng Của {order.userId?.username || "Người Dùng Không Xác Định"}
                        </Text>
                        <Text style={{ color: "#888" }}>({order.userId?.email || "Không có email"})</Text>
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
                          <Option value="pending">Chờ Xử Lý</Option>
                          <Option value="processing">Đang Xử Lý</Option>
                          <Option value="shipped">Đã Gửi Hàng</Option>
                          <Option value="delivered">Đã Giao Hàng</Option>
                          <Option value="canceled">Đã Hủy</Option>
                        </Select>
                        <Select
                          value={order.paymentStatus}
                          onChange={(value) => updateOrderPaymentStatus(order._id, value)}
                          style={{ width: "150px", borderRadius: "8px" }}
                          disabled={actionLoading}
                          loading={actionLoading}
                          size="large"
                        >
                          <Option value="Chưa thanh toán">Chưa Thanh Toán</Option>
                          <Option value="Đã thanh toán">Đã Thanh Toán</Option>
                          <Option value="Thất bại">Thất Bại</Option>
                        </Select>
                      </Space>
                    }
                  >
                    <Descriptions column={2} bordered size="small" style={{ background: "#fff", borderRadius: "8px" }}>
                      <Descriptions.Item label="Mã Đơn Hàng" span={2}>
                        <Text strong>{order.orderCode}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày Đặt Hàng">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="Tổng Tiền">
                        <Text strong style={{ color: "#1a3c34" }}>
                          {order.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Phương Thức Thanh Toán" span={2}>
                        {order.paymentMethod}
                      </Descriptions.Item>
                      <Descriptions.Item label="Địa Chỉ" span={2}>
                        {order.address
                          ? `${order.address.specificAddress}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`
                          : "Không có địa chỉ"}
                      </Descriptions.Item>
                    </Descriptions>
                    <Collapse style={{ marginTop: "20px", borderRadius: "8px" }}>
                      <Panel header="Sản Phẩm Trong Đơn Hàng" key="1">
                        <List
                          dataSource={order.items}
                          renderItem={(item) => (
                            <List.Item>
                              <Space>
                                <Text>{item.productId?.name || "Sản Phẩm Không Xác Định"}</Text>
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
              Quản Lý Người Dùng
            </Title>
            <div style={filterStyle}>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Tìm Kiếm Người Dùng</Text>
                <Input
                  placeholder="Nhập tên người dùng hoặc email"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  allowClear
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Vai Trò</Text>
                <Select
                  value={userRoleFilter}
                  onChange={(value) => setUserRoleFilter(value)}
                  placeholder="Chọn vai trò"
                  size="large"
                  style={{ borderRadius: "8px" }}
                  allowClear
                >
                  <Option value="user">Người Dùng</Option>
                  <Option value="admin">Quản Trị Viên</Option>
                </Select>
              </div>
              <div style={filterItemStyle}>
                <Text strong style={{ color: "#1a3c34" }}>Sắp Xếp Theo</Text>
                <Select
                  value={userSort}
                  onChange={(value) => setUserSort(value)}
                  placeholder="Sắp xếp theo"
                  size="large"
                  style={{ borderRadius: "8px" }}
                >
                  <Option value="date-desc">Ngày: Mới Nhất</Option>
                  <Option value="date-asc">Ngày: Cũ Nhất</Option>
                </Select>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <Button
                  onClick={handleClearUserFilters}
                  size="large"
                  style={{ borderRadius: "8px", height: "40px", fontSize: "14px" }}
                >
                  Xóa Bộ Lọc
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
                      {user.role === "admin" ? "Thu Hồi Quyền Admin" : "Cấp Quyền Admin"}
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Text strong style={{ fontSize: "16px", color: "#1a3c34" }}>
                      {user.username}
                    </Text>
                    <Text style={{ color: "#888" }}>{user.email}</Text>
                    <Text style={{ color: "#888" }}>Vai Trò: {user.role === "admin" ? "Quản Trị Viên" : "Người Dùng"}</Text>
                    <Text style={{ color: "#888" }}>
                      Tham Gia: {new Date(user.createdAt).toLocaleDateString()}
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
              Quản Lý Đánh Giá
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
                      Xóa
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Text strong style={{ fontSize: "16px", color: "#1a3c34" }}>
                      {review.productId?.name || "Sản Phẩm Không Xác Định"}
                    </Text>
                    <Text style={{ color: "#888" }}>
                      Bởi {review.userId?.username || "Ẩn Danh"}
                    </Text>
                    <Rate disabled value={review.rating} style={{ fontSize: "16px" }} />
                    {review.comment && <Text style={{ color: "#555" }}>{review.comment}</Text>}
                    <Text style={{ color: "#888" }}>
                      Đăng Vào: {new Date(review.createdAt).toLocaleDateString()}
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
              Quản Lý Giao Hàng
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
                      Cập Nhật
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Text strong style={{ fontSize: "16px", color: "#1a3c34" }}>
                      Đơn Hàng: {shipping.orderId?.orderCode || "Đơn Hàng Không Xác Định"}
                    </Text>
                    <Text style={{ color: "#888" }}>Trạng Thái: {shipping.status === "pending" ? "Chờ Xử Lý" : shipping.status === "shipped" ? "Đã Gửi Hàng" : "Đã Giao Hàng"}</Text>
                    <Text style={{ color: "#888" }}>
                      Thời Gian Giao Hàng Dự Kiến:{" "}
                      {shipping.estimatedDelivery
                        ? new Date(shipping.estimatedDelivery).toLocaleDateString()
                        : "Chưa đặt"}
                    </Text>
                    <Text style={{ color: "#888" }}>
                      Cập Nhật Lần Cuối: {new Date(shipping.updatedAt).toLocaleDateString()}
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
              Thêm Khuyến Mãi Mới
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
              Lưu Khuyến Mãi
            </Button>
          </div>
        );
      case "manage-promotions":
        return (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
            <Title level={4} style={{ color: "#1a3c34", marginBottom: "20px" }}>
              Quản Lý Khuyến Mãi
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
                      Xóa
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Text strong style={{ fontSize: "16px", color: "#1a3c34" }}>
                      {promotion.name}
                    </Text>
                    <Text style={{ color: "#888" }}>Mã: {promotion.code}</Text>
                    <Text style={{ color: "#888" }}>
                      Giảm Giá: {promotion.discount} {promotion.type === "percentage" ? "%" : "VNĐ"}
                    </Text>
                    <Text style={{ color: "#888" }}>
                      Bắt Đầu: {new Date(promotion.startDate).toLocaleDateString()}
                    </Text>
                    <Text style={{ color: "#888" }}>
                      Kết Thúc: {new Date(promotion.endDate).toLocaleDateString()}
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
            Quản Trị Viên
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
        <Header style={{ background: "#fff", padding: "0 24px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={3} style={{ margin: 0, color: "#1a3c34" }}>
            {menuItems.find((item) => item.key === currentMenu)?.label}
          </Title>
          <Button
            type="default"
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
            style={{
              borderRadius: "8px",
              padding: "0 16px",
              height: "40px",
              fontSize: "14px",
              transition: "all 0.3s",
            }}
          >
            Quay Về Trang Chủ
          </Button>
        </Header>
        <Content style={{ margin: "24px", background: "#f0f2f5" }}>
          {renderContent()}
          <Modal
            title={modal.type === "product" ? "Cập Nhật Sản Phẩm" : "Cập Nhật Giao Hàng"}
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
                  Cập Nhật Sản Phẩm
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
                <Form.Item name="status" label="Trạng Thái Giao Hàng">
                  <Select style={{ borderRadius: "8px" }}>
                    <Option value="pending">Chờ Xử Lý</Option>
                    <Option value="shipped">Đã Gửi Hàng</Option>
                    <Option value="delivered">Đã Giao Hàng</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="estimatedDelivery" label="Thời Gian Giao Hàng Dự Kiến">
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
                  Cập Nhật Giao Hàng
                </Button>
              </Form>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}