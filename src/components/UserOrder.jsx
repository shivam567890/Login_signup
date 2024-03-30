import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../utils/BaseUrl';
import { useSelector } from 'react-redux';
import queryString from 'query-string';

const UserOrder = () => {
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(false);
    const userinfo = useSelector((state) => state.user.userData);
    const allProducts = useSelector((state) => state.product.productData);


    useEffect(() => {
        const urlParams = queryString.parse(window.location.search);
        if (urlParams.paymentIntentId && urlParams.orderDetails) {
            const paymentIntent_id = urlParams.paymentIntentId;
            const orderDetails = JSON.parse(urlParams.orderDetails);
            console.log(orderDetails);
            // orderDetails=JSON.parse(orderDetails);
            const verifyPayment = async () => {
                var token = null;

                try {
                    if (userinfo) {
                        token = userinfo.tokens.access.token;
                    }
                    else {
                        throw new Error("User Not authorized");
                    }
                    const confirmResponse = await fetch(`${BASE_URL}/v1/order/confirmPayment`, {
                        method: "POST",
                        headers: {
                            'content-type': 'application/json',
                            'authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ paymentIntent_id: paymentIntent_id, orderDetails: orderDetails }),
                    });

                    if (!confirmResponse.ok) {
                        throw new Error(`Payment confirmation failed with status ${confirmResponse.status}`);
                    }
                    const result = await confirmResponse.json();
                    console.log("Payment is successfull", result);
                    setPaymentStatus(true);
                } catch (error) {
                    console.error(error);
                }

            }

            verifyPayment();
        }


    }, []);


    const fetchOrderData = async () => {
        setIsLoading(true);
        setError(null);


        try {
            var token = null;
            if (userinfo) {
                token = userinfo.tokens.access.token;
            }
            else {
                throw new Error("User not authenticated");
            }
            const response = await fetch(`${BASE_URL}/v1/order/userOrders`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch order data');
            }

            const data = await response.json();
            console.log(data, "Hello there");
            setOrderData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderData();
        // eslint-disable-next-line
    }, [paymentStatus]);

    if (isLoading) {
        return <div>Loading order details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!orderData) {
        return <div>No order data found.</div>;
    }

    // const { orderStatus, id, user, products, totalPrice, shippingAddress } = orderData;
    const addressFormatter = (shippingAddress) => {
        const formattedAddress = JSON.parse(shippingAddress);

        return formattedAddress
    } // Assuming shippingAddress is a JSON string

    return (
        <div className="userOrder">
            {
                orderData?.map((order) => (
                    <div className="user-order">
                        <h2>Order Details</h2>
                        <p>Order ID: {order.id}</p>
                        <p>Order Status: {order.orderStatus}</p>
                        <p>Customer Name: {userinfo.user.name}</p>
                        <p>Customer Email: {userinfo.user.email}</p>


                        <h3>Products</h3>
                        <ul>
                            {order.products.map((product) => (
                                <li key={product._id}>
                                    {product.product} (details not displayed due to privacy concerns) x {product.quantity}
                                </li>
                            ))}
                        </ul>
                        <p>Total Price: ₹{order.totalPrice}</p>
                        <h3>Shipping Address</h3>
                        <p>
                            {(() => {
                                const formattedAddress = addressFormatter(order.shippingAddress);
                                return (
                                    <>
                                        {formattedAddress.line}, {formattedAddress.city}, {formattedAddress.state} {formattedAddress.postal_code}, {formattedAddress.country}
                                    </>
                                );
                            })()}
                        </p>
                    </div>
                ))
            }
        </div>
    );
};

export default UserOrder;
