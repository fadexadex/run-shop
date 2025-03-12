import { SellerController } from "./controller";
import { Router } from "express";
import { adminGuard, authGuard } from "../../middlewares";
import { SellerValidator , parseQuantityAndPrice} from "../../middlewares";
import { idValidator } from "../../middlewares/validators/general";
import { uploadImage } from "../../utils/multer";

const sellerController = new SellerController();
const { validateRegisterSeller, validateAddProduct } = SellerValidator;
const router = Router();

router.post(
  "/register",
  authGuard,
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
  idValidator,
  parseQuantityAndPrice,
  validateAddProduct,
  sellerController.addProductToCatalogue
);

router.put("/:id", authGuard, sellerController.updateSeller);

router.get("/", authGuard, adminGuard, sellerController.listAllSellers);

export default router;
