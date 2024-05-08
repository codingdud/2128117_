import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';

interface Product {
  productId: number;
  productName: string;
  company: string;
  category: string;
  price: number;
  rating: number;
  discount: number;
  availability: boolean;
}
const comany=[]
const Homepage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    let source = axios.CancelToken.source();

    // const fetchProducts = async () => {
    //   try {
    //     const response: AxiosResponse<Product[]> = await axios.get(
    //       'http://20.244.56.144/test/companies/AMZ/categories/Laptop/products?top=10&minPrice=1&maxPrice=10000',
    //       {
    //         cancelToken: source?.token,
    //         headers: {
    //           Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE1MTQ3MTgwLCJpYXQiOjE3MTUxNDY4ODAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjYzMmQ0YWM2LTkyMDktNDU5MS04MDkxLTAzMGFkMTg1Y2Y4ZiIsInN1YiI6IjIxMjgwODBAa2lpdC5hYy5pbiJ9LCJjb21wYW55TmFtZSI6ImdvTWFydCIsImNsaWVudElEIjoiNjMyZDRhYzYtOTIwOS00NTkxLTgwOTEtMDMwYWQxODVjZjhmIiwiY2xpZW50U2VjcmV0IjoiWFBWcWpTTlZEaU9rYlZKdyIsIm93bmVyTmFtZSI6IlBpeXVzaCBSYW5qYW4gU2F0YXBhdGh5Iiwib3duZXJFbWFpbCI6IjIxMjgwODBAa2lpdC5hYy5pbiIsInJvbGxObyI6IjIxMjgwODAifQ.Vl7wKnPN3ixKv68Yr03VRLAgnFAZz6HcyS-NY5VqhOM`
    //         }
    //       }
    //     );
    //     setProducts(response.data);
    //     setLoading(false);
    //   } catch (error:any) {
    //     if (!axios.isCancel(error)) {
    //       setError(error.message);
    //       setLoading(false);
    //     }
    //   }
    // };
    const fetchToken = async () => {
        try {
          const requestBody = {
            "companyName": "google",
            "clientID": "4deb05a4-9c2e-452f-88da-f02b825010d0",
            "clientSecret": "LMGmtVPWxWtIgOpd",
            "ownerName": "Animesh Kumar",
            "ownerEmail": "2128117@kiit.ac.in",
            "rollNo": "2128117"
        };
  
          const response = await axios.post('http://20.244.56.144/test/auth', requestBody);
          setAccessToken(response.data.access_token);
        } catch (error:any) {
          setError(error.message);
          setLoading(false);
        }
      };
  
      const fetchProducts = async () => {
        try {
            await fetchToken();
  
          const response: AxiosResponse<Product[]> = await axios.get(
            'http://20.244.56.144/test/companies/AMZ/categories/Laptop/products?top=10&minPrice=1&maxPrice=10000',
            {
              cancelToken: source?.token,
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          );
          setProducts(response.data);
          setLoading(false);
        } catch (error:any) {
          if (!axios.isCancel(error)) {
            setError(error.message);
            setLoading(false);
          }
        }
      };


    fetchProducts();

    // Clean up function
    return () => {
      source.cancel('Request canceled by cleanup');
    };
  }, [accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Top N Products</h1>
      <div>
        {products.map((product) => (
          <div key={product.productId}>
            <Link to={{
                pathname: '/product',
                search: `?productName=${product.productName}&company=${product.company}&category=${product.category}&price=${product.price}&rating=${product.rating}&discount=${product.discount}&availability=${product.availability ? 'Available' : 'Out of stock'}`
              }}>
              <h2>{product.productName}</h2>
              <p>Company: {product.company}</p>
              <p>Category: {product.category}</p>
              <p>Price: {product.price}</p>
              <p>Rating: {product.rating}</p>
              <p>Discount: {product.discount}</p>
              <p>Availability: {product.availability ? 'Available' : 'Out of stock'}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;