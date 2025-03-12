import { ProductController } from "./controller";
import { Router } from "express";
import { authGuard } from "../../middlewares/auth.middleware";
import {
  productIdValidator,
  productFiltersValidator,
} from "../../middlewares/validators/product/validators";

const productController = new ProductController();
const router = Router();

router.get(
  "/all",
  authGuard,
  productFiltersValidator,
  productController.getAllProducts
);
router.get(
  "/:id",
  authGuard,
  productIdValidator,
  productController.getProductById
);

export default router;
