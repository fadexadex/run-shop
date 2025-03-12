import { Request, Response, NextFunction } from "express";
import { validateId, registerSellerSchema, updateSellerSchema, addProductSchema, updateProductSchema } from "./schemas";

export class SellerValidator {
  static async validateUserId(req: Request, res: Response, next: NextFunction) {
    const { error } = validateId.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  }

  static async validateRegisterSeller(req: Request, res: Response, next: NextFunction) {
    const { error } = registerSellerSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ message: error.details.map((err) => err.message).join(", ") });
    }

    next();
  }

  static async validateUpdateSeller(req: Request, res: Response, next: NextFunction) {
    const { error } = updateSellerSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ message: error.details.map((err) => err.message).join(", ") });
    }

    next();
  }

  static async validateAddProduct(req: Request, res: Response, next: NextFunction) {
    const { error } = addProductSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ message: error.details.map((err) => err.message).join(", ") });
    }

    next();
  }
  static async validateUpdateProduct(req: Request, res: Response, next: NextFunction) {
    const { error } = updateProductSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ message: error.details.map((err) => err.message).join(", ") });
    }

    next();
  }
}