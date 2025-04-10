// HeroSection.js
import React from 'react';

export default function HeroSection() {
  const heroStyle = {
    backgroundImage: `url("https://i.pinimg.com/736x/97/e2/1e/97e21e99b46d808223e066bee1a5f27f.jpg")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '500px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '0 50px',
    borderRadius: '10px',
    margin: '20px',
  };

  const textContainerStyle = {
    maxWidth: '50%',
    color: '#fff',
  };

  const smallTextStyle = {
    color: '#ff6200', 
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const headingStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '0',
    lineHeight: '1.2',
  };

  const subheadingStyle = {
    fontSize: '16px',
    margin: '20px 0',
  };

  const buttonStyle = {
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  return (
    <div style={heroStyle}>
      <div style={textContainerStyle}>
        <p style={smallTextStyle}>LIMITED QUANTITY</p>
        <h1 style={headingStyle}>MAXIMIZE YOUR MAC MINI</h1>
        <p style={subheadingStyle}>
          Blazing-fast transfers. Expanded storage. Effortless power access. Discover our latest innovation—get yours before it’s gone!
        </p>
        <button style={buttonStyle}>Shop Now</button>
      </div>
    </div>
  );
}