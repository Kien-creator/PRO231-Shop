import React from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import { useSearch } from "../Contexts/SearchContext";

export default function Header() {
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useSearch();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const headerStyle = {
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
  };

  const searchBarContainerStyle = {
    display: "flex",
    justifyContent: "center",
    padding: "10px 0",
  };

  const showSearchBar = location.pathname === "/shop";

  return (
    <div style={headerStyle}>
      <NavBar />
    </div>
  );
}
