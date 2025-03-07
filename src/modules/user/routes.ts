import { UserController } from "./controller";
import { Router } from "express";
import {
  validateUpdateUser,
  validateUserId,
} from "../../middlewares/validators/user/validators";
import { authGuard } from "../../middlewares";

const userController = new UserController();

const router = Router();

router.get("/:user_id", authGuard, validateUserId, userController.getUserById);
router.put("/update", authGuard, userController.updateUser);


export default router;
