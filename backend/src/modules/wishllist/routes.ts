import { CartController } from "./controller";
import { Router } from "express";
import { validateUserId } from "../../middlewares/validators/user/validators";
import { authGuard } from "../../middlewares";

const cartController = new CartController();

const router = Router();

// router.get("/:user_id", authGuard, validateUserId, userController.getUserById);
// router.put("/update", authGuard, userController.updateUser);

export default router;
