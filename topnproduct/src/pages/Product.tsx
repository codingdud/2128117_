import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Product: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Accessing individual query parameters
  const productName = searchParams.get('productName');
  const company = searchParams.get('company');
  const category = searchParams.get('category');
  const price = searchParams.get('price');
  const rating = searchParams.get('rating');
  const discount = searchParams.get('discount');
  const availability = searchParams.get('availability');

  // Check if any required parameter is missing or invalid
  if (!productName || !company || !category || !price || !rating || !discount || !availability) {
    return <div>Error: Invalid product</div>;
  }

  return (
    <div>
      <h1>Product Details</h1>
      <p>Product Name: {productName}</p>
      <p>Company: {company}</p>
      <p>Category: {category}</p>
      <p>Price: {price}</p>
      <p>Rating: {rating}</p>
      <p>Discount: {discount}</p>
      <p>Availability: {availability}</p>
    </div>
  );
};

export default Product;
