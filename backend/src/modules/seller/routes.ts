import { SellerController } from "./controller";
import { Router } from "express";
import { adminGuard, authGuard, validateFile } from "../../middlewares";
import { SellerValidator, parseQuantityAndPrice } from "../../middlewares";
import { idValidator } from "../../middlewares/validators/general";
import { uploadImage } from "../../utils/multer";

const sellerController = new SellerController();
const { validateRegisterSeller, validateAddProduct , validateUpdateProduct} = SellerValidator;
const router = Router();

router.post(
  "/register",
  authGuard,
  uploadImage.single("cataloguePicture"),
  validateRegisterSeller,
  sellerController.registerSeller
);

router.get(
  "/:id/catalogue",
  authGuard,
  idValidator,
  sellerController.getSellerCatalogue
);

router.post(
  "/:id/catalogue",
  authGuard,
  uploadImage.array("files", 4),
  validateFile,
  idValidator,
  parseQuantityAndPrice,
  validateAddProduct,
  sellerController.addProductToCatalogue
);

//update product in catalogue
router.put(
  "/:id/catalogue",
  authGuard,
  uploadImage.array("files", 4),
  idValidator,
  parseQuantityAndPrice,
  validateUpdateProduct,
  sellerController.updateProduct
);
// router.delete("/:id", authGuard, adminGuard, productIdValidator, productController.deleteProduct);

router.put(
  "/:id",
  authGuard,
  idValidator,
  uploadImage.single("cataloguePicture"),
  sellerController.updateSeller
);

router.get("/", authGuard, adminGuard, sellerController.listAllSellers);

export default router;
