import { useState } from "react";
const CartItem = ({ item, onRemoveItem, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(item.quantity);

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
            onQuantityChange(item.product, newQuantity-item.quantity);
            console.log(`Quantity: ${newQuantity}`);
        }
    };

    const handleRemoveItem = () => {
        onRemoveItem(item.product);
    };

    return (
        <div className="cart-item">
            <img src='https://www.reliancedigital.in/medias/Redmi-A2-Plus-493838651-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wxNDQ3NDh8aW1hZ2UvanBlZ3xpbWFnZXMvaDBmL2hmMi8xMDA1ODk1NDA0NzUxOC5qcGd8ZjY1NWM4YmE0NmY0ZTEzMTAwNTQ4ZGNjM2RhOGNlYTQ5MGJmZGE2ZWNjOWEzN2U0YjJkNTdlZmNjNzRjNjMwZg' alt={item.product.name} />
            <div className="cart-item-details">
                <h4>{item.product.name}</h4>
                <p>Price: ₹{item.price}</p>
                <div className="quantity-control">
                    <label htmlFor={`quantity-${item._id}`}>Quantity:</label>
                    <input
                        type="number"
                        id={`quantity-${item._id}`}
                        value={quantity}
                        onChange={handleQuantityChange}
                        min={1}
                    />
                </div>
            </div>
            <div className="remove-btn">
            <button onClick={handleRemoveItem}>Remove</button>

            </div>
        </div>
    );
};

export default CartItem;