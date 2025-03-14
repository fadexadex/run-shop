import axios from "axios";

const createPaymentLink = async (orderId: string, amount: number, email: string) => {
  try {
    const API_KEY = "YOUR_SQUAD_SECRET_KEY"; // Replace with actual Squad secret key
    const API_URL = "https://api.squadco.com/merchant/payment-link"; // Confirm the correct endpoint
    const BASE_PAYMENT_URL = "https://sandbox-pay.squadco.com/"; // Change for live environment if needed

    const hash = `order-${orderId}`; // Unique hash for the order

    const payload = {
      name: "Order Payment",  
      hash, // Custom hash used for generating the payment link
      link_status: 1,
      expire_by: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // Expires in 10 minutes
      amounts: [
        {
          amount, 
          currency_id: "NGN",
        },
      ],
      description: `Payment for Order ${orderId}`,
      redirect_link: "https://yourwebsite.com/payment-success", 
      return_msg: "Successful",
      metadata: {
        orderId,
        customer_email: email,
      },
    };

    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(API_URL, payload, { headers });

    // Construct the actual payment link using the hash
    const paymentLink = `${BASE_PAYMENT_URL}${hash}`;

    console.log("Payment Link Created:", paymentLink);
    return { paymentLink, responseData: response.data };
  } catch (error) {
    console.error("Error creating payment link:", error.response?.data || error.message);
    throw error;
  }
};

// Example usage
createPaymentLink("123456", 400000, "customer@example.com")
  .then(({ paymentLink }) => console.log("Payment Link:", paymentLink))
  .catch((err) => console.error(err));
