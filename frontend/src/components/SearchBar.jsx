import React, { useState, useEffect } from "react";
import { AutoComplete } from "antd";
import axios from "axios";

export function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {}
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        const filteredOptions = products
          .filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((product) => ({
            value: product.name,
            label: product.name,
          }));
        setOptions(filteredOptions);
      } else {
        setOptions([]);
      }
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch, products]);

  const onSelect = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <AutoComplete
      options={options}
      onSelect={onSelect}
      onSearch={(value) => setSearchTerm(value)}
      value={searchTerm}
      style={{ width: 250 }}
      placeholder="Search for products..."
      allowClear
    />
  );
}