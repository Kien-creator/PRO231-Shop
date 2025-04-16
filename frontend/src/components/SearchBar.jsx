import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSearch } from "../Contexts/SearchContext";

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [inputValue, setInputValue] = useState(searchTerm); // Local state for input value

  // Debounce effect to update searchTerm after typing stops
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchTerm(inputValue); // Update searchTerm after 500ms delay
    }, 500);

    // Cleanup: Clear the timer if inputValue changes before 500ms
    return () => clearTimeout(debounceTimer);
  }, [inputValue, setSearchTerm]);

  return (
    <Input
      placeholder="Tìm sản phẩm"
      value={inputValue} // Use local state for controlled input
      onChange={(e) => setInputValue(e.target.value)} // Update local state on change
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