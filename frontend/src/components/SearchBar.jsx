import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSearch } from "../Contexts/SearchContext";

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [inputValue, setSearchTerm]);

  return (
    <Input
      placeholder="Tìm sản phẩm"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      prefix={<SearchOutlined style={{ color: "#1a3c34" }} />}
      style={{
        width: "240px",
        height: "40px",
        borderRadius: "20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        fontSize: "14px",
      }}
      allowClear
    />
  );
}
