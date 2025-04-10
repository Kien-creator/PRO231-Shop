import React from "react";

export default function Home() {
  const pageStyle = {
    backgroundImage: `url("https://i.pinimg.com/1200x/84/7e/1b/847e1ba6c73eadf38934a6cd940fee56.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center", 
    height: "100vh", 
    display: "flex", 
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white", 
    textAlign: "center",
  };

  return (
    <div style={pageStyle}>
      <h1>Welcome to Fake Shop</h1>
      <p>Everything you want is here!</p>
    </div>
  );
}
