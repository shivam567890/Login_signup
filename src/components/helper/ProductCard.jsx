import React from 'react';
import './ProductCard.css'

import { BASE_URL } from '../../utils/BaseUrl';
import { useSelector } from 'react-redux';
const ProductCard = ({ productData }) => {
    const { name, available, description, price, image } = productData;
    const user = useSelector((state) => state.user.userData);
    var token = null;
    if (user) {
        token = user.tokens.access.token;
    }

    const handleAddToCart = async() => {
        try {
            const response = await fetch(`${BASE_URL}/v1/userCart/addItems`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({product_id: productData.id})
            });
      
            if (!response.ok) {
              throw new Error(`product adding in cart failed with status: ${response.status}`);
            }
      
            const data = await response.json();
           
          } catch (error) {
            console.error('Product fetching error:', error);
            
          } 
    }

    // console.log(productData);

    return (
        <div className="product-card">
            <img src={image || 'https://www.reliancedigital.in/medias/Redmi-A2-Plus-493838651-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wxNDQ3NDh8aW1hZ2UvanBlZ3xpbWFnZXMvaDBmL2hmMi8xMDA1ODk1NDA0NzUxOC5qcGd8ZjY1NWM4YmE0NmY0ZTEzMTAwNTQ4ZGNjM2RhOGNlYTQ5MGJmZGE2ZWNjOWEzN2U0YjJkNTdlZmNjNzRjNjMwZg'} alt={name} />
            <div className="product-details">
                <div className="details">
                <h2>{name}</h2>
                <p><span >Available: </span>{available}</p>
                <p><span>Description:</span> {description}</p>
                <p><span>Price:</span> ${price}</p>
                </div>
                <div className="add-btn">
                    <button onClick={handleAddToCart} className='card-btn'>Add To Cart</button>
                    <button className='show-btn'>Show Details</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
