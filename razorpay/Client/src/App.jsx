import { useState } from 'react'
import './App.css'
import { useRazorpay } from "react-razorpay";

function App() {

  const { error, isLoading, Razorpay } = useRazorpay();


  const handlePayment = () => {
    const options = {
      key: "rzp_test_TBrRmZc2shBNA4",
      amount: 199800, // Amount in paise
      currency: "INR",
      name: "Tesla",
      description: "Test Transaction",
      order_id: "order_TBraTKmGRUALJr", // Generate order_id on server
      handler: (response) => {
        console.log(response);
        alert("Payment Successful!");
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };


  return (
    <button onClick={handlePayment}>
      Pay Now
    </button>
  )
}

export default App
