import { SellerController } from "./controller";
import { Router } from "express";
import { adminGuard, AuthValidator } from "../../middlewares";
import { authGuard } from "../../middlewares";
// POST /sellers/register → Register a seller profile
// GET /sellers/:seller_id → Get seller details
// PUT /sellers/:seller_id → Update seller profile
// GET /sellers → List all sellers

const sellerController = new SellerController();

const router = Router();

router.post(
  "/register",
);

router.get("/:seller_id", authGuard, );

router.put("/:seller_id", authGuard, );

router.get("/", authGuard, adminGuard, );


export default router;
