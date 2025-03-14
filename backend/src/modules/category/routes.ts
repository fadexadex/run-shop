import { CategoryController } from "./controller";
import { Router } from "express";
import { authGuard, adminGuard } from "../../middlewares/auth.middleware";
import { categoryValidator, categoryIdValidator } from "../../middlewares";

const categoryController = new CategoryController();

const router = Router();

router.post("/create",authGuard, adminGuard,categoryValidator, categoryController.createCategory); 

router.get("/all", categoryController.getAllCategories);

router.get("/only", categoryController.getOnlyCategories);

router.get("/:id", categoryIdValidator, categoryController.getCategoryProducts);

router.put("/:id",authGuard, adminGuard, categoryIdValidator, categoryValidator,  categoryController.updateCategory);

router.delete("/:id", authGuard, adminGuard, categoryIdValidator, categoryController.deleteCategory); 

export default router;
