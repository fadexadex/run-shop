import { OrderController } from "./controller";
import { Router } from "express";
import { validateOrder } from "../../middlewares/validators/order/validators";
import { authGuard } from "../../middlewares/auth.middleware";

const orderController = new OrderController();
const router = Router();

router.post("/create", authGuard, validateOrder, orderController.createOrder);

router.get("/:id/seller", authGuard, orderController.getSellerOrders);

export default router;