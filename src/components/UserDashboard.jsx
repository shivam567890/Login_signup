import React, { useEffect, useState } from 'react';
import ProductCard from './helper/ProductCard';
import { Rings } from 'react-loader-spinner'
import { BASE_URL } from '../utils/BaseUrl';
import { useDispatch } from 'react-redux';
import { productSuccess } from '../services/productSlice';

const UserDashboard = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const dispatch = useDispatch();
  const getProduct = async () => {
    setIsLoading(true);
    setError(null); // Reset error state on each fetch
    try {
      const response = await fetch(`${BASE_URL}/v1/products/getAllProduct`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Product fetching failed with status: ${response.status}`);
      }

      const data = await response.json();
      setAllProducts(data);
      dispatch(productSuccess(data));
    } catch (error) {
      console.error('Product fetching error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="user-dashboard">
      <h2>Products</h2>
      {isLoading ? (

        <div className="" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rings
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="rings-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
          <p className="">Loading products...</p>
        </div>

      ) : error ? (
        <p>Error fetching products: {error}</p>
      ) : allProducts.length > 0 ? (
        <div className="product-container">
          {allProducts.map((product) => (
            <div key={product.id || product._id}>
              <ProductCard productData={product} />
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default UserDashboard;
