import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { BASE_URL } from '../utils/BaseUrl';
import { useSelector } from 'react-redux';

const CheckoutForm = ({clientSecret,paymentIntent_id,orderDetails}) => {
  const stripe = useStripe();
  const elements = useElements();
  const user = useSelector((state) => state.user.userData);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }

    const serializedOrderDetails = encodeURIComponent(JSON.stringify(orderDetails));

    const {error} = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/userOrder?paymentIntentId=${paymentIntent_id}&orderDetails=${serializedOrderDetails}`,
      },
    });


    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      // setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || !elements}>
        Pay
      </button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};
const Checkout = ({clientSecret,amount,currency,paymentIntent_id,orderDetails}) => {
  const stripePromise = loadStripe('pk_test_51OjJKWSJago1WNDSjLcH75nK60n7G2ROwL8blkGvTYrnDkRbvgnJoiQa5hpfLf0HsJYqA4c3oFRLZz7OtXDfTWX600KxFYTcxO');
 
  const options = {
    // passing the client secret obtained from the server
    // mode: "payment",
    // amount: amount,
    // currency: currency,
     clientSecret: clientSecret
    
  };
  console.log(options);
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm clientSecret={clientSecret} paymentIntent_id={paymentIntent_id} orderDetails={orderDetails}/>
    </Elements>
  )
}

export default Checkout