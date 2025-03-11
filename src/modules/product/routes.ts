import { ProductController } from "./controller";
import { Router } from "express";
import { authGuard, adminGuard } from "../../middlewares";

const productController = new ProductController();
const router = Router();

router.post(
  "/products",
  authGuard,
  // productController.addProduct
);

router.get(
  "/products",
  // productController.getAllProducts
);

router.get(
  "/products/:product_id",
  // productController.getProductDetails
);

router.put(
  "/products/:product_id",
  authGuard,
  // productController.updateProduct
);

router.delete(
  "/products/:product_id",
  authGuard,
  // productController.removeProduct
);

export default router;