import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function ProductList({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        setProducts(response.data);
        setFilteredProducts(response.data);
        setError(null);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("No products available in the store.");
        } else {
          setError("Failed to load products. Please try again later.");
        }
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const listStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
    padding: "20px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  if (error) {
    return <div style={{ padding: "20px", textAlign: "center" }}>{error}</div>;
  }

  return (
    <div style={listStyle}>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            productId={product._id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))
      ) : (
        <p style={{ textAlign: "center" }}>
          {products.length === 0 ? "No products available." : "No products match your search."}
        </p>
      )}
    </div>
  );
}