import React from "react";
import ProductList from "../components/ProductList";
import { useSearch } from "../Contexts/SearchContext";

export default function Shop() {
  const { searchTerm } = useSearch(); 

  return (
    <div>
      <ProductList searchTerm={searchTerm} />
    </div>
  );
}