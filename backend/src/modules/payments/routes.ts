import { Router } from "express";
import { PaymentController } from "./controller";
import { authGuard } from "../../middlewares";
import { validateInitiatePayment } from "../../middlewares/validators/payment/validators";

const router = Router();
const paymentController = new PaymentController();

router.post(
  "/initiate",
  // authGuard,
  validateInitiatePayment,
  paymentController.initiatePayment
);
// router.post("/webhook", paymentController.handleWebHook);

export default router;
