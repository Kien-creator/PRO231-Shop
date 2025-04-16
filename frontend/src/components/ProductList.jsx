import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { Select, Slider, InputNumber, Button, Pagination, Spin, Typography } from "antd";

const { Option } = Select;
const { Text } = Typography;

export default function ProductList({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [minStock, setMinStock] = useState(0);
  const [sort, setSort] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: pageSize,
          search: searchTerm || "",
          categoryId: categoryId || "",
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minStock: minStock || 0,
          sort: sort || "",
        };

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { params });
        setProducts(Array.isArray(response.data.products) ? response.data.products : []);
        setTotal(response.data.total || 0);
        setError(null);
      } catch (error) {
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm, currentPage, pageSize, categoryId, priceRange, minStock, sort]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setCategoryId("");
    setPriceRange([0, 10000000]);
    setMinStock(0);
    setSort("");
    setCurrentPage(1);
  };

  const listStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    padding: "20px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const filterStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    padding: "20px",
    background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    margin: "0 auto 30px",
    maxWidth: "1400px",
  };

  const filterItemStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: "220px",
    flex: 1,
  };

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Text type="danger" style={{ fontSize: "16px" }}>
          {error}
        </Text>
      </div>
    );
  }

  return (
    <div>
      <div style={filterStyle}>
        <div style={filterItemStyle}>
          <Text strong style={{ color: "#1a3c34" }}>
            Category
          </Text>
          <Select
            value={categoryId}
            onChange={(value) => setCategoryId(value)}
            placeholder="Select category"
            style={{ width: "100%", borderRadius: "8px" }}
            allowClear
            size="large"
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))
            ) : (
              <Option disabled>No categories available</Option>
            )}
          </Select>
        </div>
        <div style={filterItemStyle}>
          <Text strong style={{ color: "#1a3c34" }}>
            Price Range
          </Text>
          <Slider
            range
            min={0}
            max={10000000}
            value={priceRange}
            onChange={(value) => setPriceRange(value)}
            step={100000}
            style={{ margin: "10px 0" }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <InputNumber
              min={0}
              max={10000000}
              value={priceRange[0]}
              onChange={(value) => setPriceRange([value, priceRange[1]])}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              style={{ borderRadius: "8px", flex: 1 }}
            />
            <Text style={{ alignSelf: "center" }}>-</Text>
            <InputNumber
              min={0}
              max={10000000}
              value={priceRange[1]}
              onChange={(value) => setPriceRange([priceRange[0], value])}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              style={{ borderRadius: "8px", flex: 1 }}
            />
          </div>
        </div>
        <div style={filterItemStyle}>
          <Text strong style={{ color: "#1a3c34" }}>
            Minimum Stock
          </Text>
          <InputNumber
            min={0}
            value={minStock}
            onChange={(value) => setMinStock(value)}
            style={{ width: "100%", borderRadius: "8px" }}
            size="large"
          />
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
            allowClear
            size="large"
          >
            <Option value="price-asc">Price: Low to High</Option>
            <Option value="price-desc">Price: High to Low</Option>
            <Option value="sold-asc">Sold: Low to High</Option>
            <Option value="sold-desc">Sold: High to Low</Option>
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

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={listStyle}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                price={product.price}
                image={product.images?.[0] || ""}
              />
            ))
          ) : (
            <Text style={{ textAlign: "center", gridColumn: "1 / -1", fontSize: "16px", color: "#888" }}>
              No products found.
            </Text>
          )}
        </div>
      )}

      {total > pageSize && !loading && (
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
    </div>
  );
}
