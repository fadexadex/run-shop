import axios from "axios";
import { PaymentResponse } from "../../../utils/types";
import { AppError } from "../../../middlewares";
import { OrderRepository } from "../../../modules/order/repository";

const SQUAD_URL = "https://sandbox-api-d.squadco.com/transaction/initiate";
const SECRET_KEY = "Bearer sandbox_sk_88fa854e4afb46efcf8fb9e5090458d75ac50640be83";

const orderRepository = new OrderRepository();

export class PaymentService {
  initiatePayment = async (
    email: string,
    name: string,
    amount: number,
    orderId: string
  ): Promise<PaymentResponse> => {
    try {
      const headers = {
        Authorization: SECRET_KEY,
        "Content-Type": "application/json",
      };

      const payload = {
        email,
        amount: amount * 100, 
        currency: "NGN",
        customer_name: name,
        initiate_type: "inline",
        transaction_ref: `TRX_${Date.now()}`,
        callback_url: "https://payment-success-check",
        payment_channels: ["card", "bank", "ussd", "transfer"],
        metadata: { order_id: orderId },
      };

      const { data } = await axios.post(SQUAD_URL, payload, { headers });

      if (data.status === 200) {
        const { checkout_url, transaction_ref } = data.data;
        console.log(
          `Transaction initiated: ${transaction_ref}, Order ID: ${orderId}`
        );

        return { checkoutUrl: checkout_url, transactionRef: transaction_ref };
      } else {
        throw new AppError("Failed to initiate transaction", 500);
      }
    } catch (error: any) {
      console.error("Error initiating payment:", error.message);
      throw error;
    }
  };

  handleWebHook = async (
    transaction_ref: string,
    meta: { order_id: string }
  ) => {
    if (!transaction_ref || !meta?.order_id) {
      console.error("Invalid webhook data received");
      throw new AppError("Invalid webhook data received", 400);
    }

    const orderId = meta.order_id;
    await orderRepository.updateOrderStatus(orderId, "CONFIRMED");
    console.log(`Order ${orderId} confirmed successfully`);
  };
}
