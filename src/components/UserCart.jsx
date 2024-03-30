import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../utils/BaseUrl';
import { useSelector } from 'react-redux';
import CartItem from './helper/CartItem';
import { useNavigate } from 'react-router-dom';
import Checkout from '../stripe/Checkout';


const UserCart = () => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [cartData, setCartData] = useState([]);
    const [clientSecret, setClientSecret] = useState(null);
    const [amount, setAmount] = useState(null);
    const [paymentIntent_id, setPaymentIntent_id] = useState(null);
    const [orderDetails,setOrderDetails] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const user = useSelector((state) => state.user.userData);
    var token = null;
    if (user) {
        token = user.tokens.access.token;
    }
    const getCartProduct = async () => {
        setIsLoading(true);
        setError(null); // Reset error state on each fetch
        try {
            const response = await fetch(`${BASE_URL}/v1/userCart/getUserCart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`User cart products fetching  failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            setCartData(data);
        } catch (error) {
            console.error('User cart  fetching error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCartProduct();
    }, []);




    const onQuantityChange = async (product_id, incrementBy) => {
        try {
            // setIsLoading(true);
            console.log("incrementBy: " + incrementBy);
            const response = await fetch(`${BASE_URL}/v1/userCart/updateItems`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product: product_id, incrementBy: incrementBy })
            });

            if (!response.ok) {
                throw new Error(`User cart products quantity updation  failed with status: ${response.status}`);
            }

            const data = await response.json();
            // console.log(data);
            setCartData(data.items);
        } catch (error) {
            console.error('User cart  updating error:', error);
            // setError(error.message);

        }
    }


    const onRemoveItem = async (product_id) => {
        try {
            // setIsLoading(true);

            const response = await fetch(`${BASE_URL}/v1/userCart/removeItems`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: product_id })
            });

            if (!response.ok) {
                throw new Error(`User cart products quantity updation  failed with status: ${response.status}`);
            }

            const data = await response.json();
            // console.log(data);
            setCartData(data.result.items);
        } catch (error) {
            console.error('User cart  updating error:', error);
            // setError(error.message);

        }
    }

    useEffect(() => {
        // Calculate total price based on cart items
        const newTotalPrice = cartData?.reduce((acc, item) => {
            return acc + item.quantity * item.price;
        }, 0);
        setTotalPrice(newTotalPrice);
    }, [cartData]);


    // funtion for placing user order
    const userAddressDetails={
        "shippingAddress":{
              "line":"510 Townsend St",
              "postal_code": "98140",
              "city":"San Francisco",
              "state": "CA",
              "country": "US"
            },
        "description":"This is test description"
    }
    const handlePlaceOrder = async() => {
        try {
            // setIsLoading(true);

            const response = await fetch(`${BASE_URL}/v1/order/make_order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userAddressDetails)
            });

            if (!response.ok) {
                throw new Error(`Order failed with status: ${response.status}`);
            }

            const PaymentIntent = await response.json();
            setAmount(PaymentIntent.paymentIntentResult.amount);
            setClientSecret(PaymentIntent.paymentIntentResult.client_secret);
            setCurrency(PaymentIntent.paymentIntentResult.currency);
            setPaymentIntent_id(PaymentIntent.paymentIntentResult.id);
            setOrderDetails(PaymentIntent.orderDetails);
            console.log(PaymentIntent);
        } catch (error) {
            console.error('error in making order:', error);
            // setError(error.message);

        }
    }
    return (
        <div className="user-cart-checkout">
            <h2>Your Cart</h2>
            {cartData.length > 0 ? (
                <ul>
                    {cartData.map((item) => (
                        <CartItem
                            key={item._id}
                            item={item}
                            onRemoveItem={onRemoveItem}
                            onQuantityChange={onQuantityChange}
                        />

                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
            {cartData.length > 0 && (
                <div className="cart-checkout-summary">
                    <p>Total Price: ₹{totalPrice}</p>
                    <button onClick={handlePlaceOrder} >PLACE ORDER</button>
                </div>
            )}
            {clientSecret && (
                <div className="checkout-popup">

                {/* <button className="close-popup" onClick={handleClosePopup}>
                  &times;
                </button> */}
      
                <div className="checkout-from">
                  <Checkout
                    amount={amount}
                    currency={currency}
                    clientSecret={clientSecret}
                    paymentIntent_id={paymentIntent_id}
                    orderDetails={orderDetails}
                  />
                </div>
              </div>
            )
                
            }
        </div>
    );
};

export default UserCart;
