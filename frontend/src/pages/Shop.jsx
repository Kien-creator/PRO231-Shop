import React, { useState, useEffect } from "react";
import { List, Card, Typography, Spin, Select, Space, Tag, Pagination, message, Button } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../Contexts/SearchContext";
import { useCart } from "../Contexts/CartContext";
import SearchBar from "../components/SearchBar";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(undefined); // Changed from "" to undefined
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 8;
  const { searchTerm } = useSearch();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    message.info("Chào mừng đến với cửa hàng của chúng tôi! Tìm kiếm sản phẩm yêu thích bên dưới.");
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, currentPage, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/categories`);
      console.log("Categories response:", response.data);
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to load categories:", err.response?.data || err.message);
      message.error("Không thể tải danh mục. Vui lòng thử lại sau.");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { 
        search: searchTerm,
        page: currentPage,
        limit: pageSize,
      };
      if (categoryFilter) params.categoryId = categoryFilter;
      console.log("Fetching products with params:", params);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { params });
      console.log("Products response (full):", JSON.stringify(response.data, null, 2));
      setProducts(Array.isArray(response.data.products) ? response.data.products : response.data);
      setTotalProducts(response.data.total || 0);
    } catch (err) {
      console.error("Failed to load products:", err.response?.data || err.message);
      message.error("Không thể tải sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      message.error("Sản phẩm này đã hết hàng!");
      return;
    }
    console.log("Adding to cart:", product);
    addToCart(product);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px" }}>
      {/* Category Filter and SearchBar Outside the Main Div */}
      <Space style={{ marginBottom: "20px", width: "100%", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Title level={3} style={{ color: "#1a3c34", margin: 0 }}>
          Cửa Hàng
        </Title>
        <Space>
          <Select
            placeholder="Chọn danh mục"
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 200 }}
            allowClear
          >
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
          <SearchBar />
        </Space>
      </Space>

      {/* Main Div for Product List and Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <Text style={{ display: "block", marginTop: "10px", color: "#666" }}>
            Đang tải sản phẩm, vui lòng chờ...
          </Text>
        </div>
      ) : (
        <div
          style={{
            background: "#E8F5E9", // Shopee-inspired light green
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            padding: "20px",
          }}
        >
          {products.length === 0 ? (
            <Text style={{ display: "block", textAlign: "center", fontSize: "16px", color: "#888" }}>
              Không có sản phẩm nào phù hợp với tìm kiếm của bạn.
            </Text>
          ) : (
            <>
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                dataSource={products}
                renderItem={(product) => {
                  console.log("Rendering product:", product);
                  return (
                    <List.Item key={product._id}>
                      <Card
                        hoverable
                        cover={
                          product.images && product.images[0] ? (
                            <img
                              alt={product.name || "Sản phẩm"}
                              src={product.images[0]}
                              style={{ height: "200px", objectFit: "cover", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/200";
                                console.log("Image load error for:", product.name, "URL:", product.images[0]);
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                height: "200px",
                                background: "#f5f5f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderTopLeftRadius: "12px",
                                borderTopRightRadius: "12px",
                              }}
                            >
                              <Text type="secondary">Không có ảnh</Text>
                            </div>
                          )
                        }
                        style={{ borderRadius: "12px", minHeight: "350px", position: "relative" }}
                      >
                        {product.stock === 0 && (
                          <Tag
                            color="red"
                            style={{
                              position: "absolute",
                              top: "10px",
                              left: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            Hết hàng
                          </Tag>
                        )}
                        <Card.Meta
                          title={
                            <Text
                              strong
                              style={{
                                color: "#1a3c34",
                                display: "block",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {product.name || "Sản phẩm không tên"}
                            </Text>
                          }
                          description={
                            <Space direction="vertical" style={{ width: "100%" }}>
                              <Text style={{ color: "#e91e63", fontWeight: "bold" }}>
                                {(product.price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                              </Text>
                              <Text type="secondary">{product.categoryId?.name || "Không có danh mục"}</Text>
                              <Text type="secondary">Kho: {product.stock}</Text>
                              <Space style={{ marginTop: "10px" }}>
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    console.log("Navigating to product:", product._id);
                                    navigate(`/product/${product._id}`);
                                  }}
                                  style={{
                                    backgroundColor: "#00C853", // Shopee vibrant green
                                    borderColor: "#00C853",
                                    transition: "transform 0.3s ease",
                                  }}
                                  disabled={product.stock === 0}
                                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                >
                                  Xem chi tiết
                                </Button>
                                <Button
                                  onClick={() => handleAddToCart(product)}
                                  disabled={product.stock === 0}
                                  style={{
                                    backgroundColor: "#ff9800", // Shopee orange
                                    borderColor: "#ff9800",
                                    color: "#fff",
                                    transition: "transform 0.3s ease",
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                >
                                  Thêm giỏ
                                </Button>
                              </Space>
                            </Space>
                          }
                        />
                      </Card>
                    </List.Item>
                  );
                }}
              />
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalProducts}
                onChange={(page) => setCurrentPage(page)}
                style={{ textAlign: "center", marginTop: "20px" }}
                showSizeChanger={false}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}