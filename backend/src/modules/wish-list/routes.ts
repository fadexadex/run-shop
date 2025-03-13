import {  WishListController } from "./controller";
import { Router } from "express";
import { authGuard } from "../../middlewares";
import { idValidator } from "../../middlewares/validators/general";


const wishListController = new WishListController();

const router = Router();

router.post("/add", authGuard, wishListController.addProductToWishlist);
router.delete("/remove/:productId", authGuard,idValidator, wishListController.removeProductFromWishlist);
router.get("/", authGuard, wishListController.getUserWishlist);

export default router;
