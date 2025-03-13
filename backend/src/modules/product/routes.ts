import { ProductController } from "./controller";
import { Router } from "express";
import {
  productIdValidator,
  productFiltersValidator,
} from "../../middlewares/validators/product/validators";

const productController = new ProductController();
const router = Router();

router.get(
  "/all",
  productFiltersValidator,
  productController.getAllProducts
);

//search products

router.get(
  "/:id",
  productIdValidator,
  productController.getProductById
);



export default router;
