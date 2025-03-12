import { Request, Response, NextFunction } from "express";
import { validateId, productSchema, updateProductSchema, productFiltersSchema } from "./schemas";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../middlewares/error.handler";

export const productIdValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = validateId.validate(req.params);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
  next();
};

export const productValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    next(
      new AppError(
        error.details.map((err) => err.message).join(", "),
        StatusCodes.BAD_REQUEST
      )
    );
  }
  next();
};

export const updateProductValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateProductSchema.validate(req.body);
  if (error) {
    next(
      new AppError(
        error.details.map((err) => err.message).join(", "),
        StatusCodes.BAD_REQUEST
      )
    );
  }
  next();
};

export const productFiltersValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(!req.query.filters) return next();
  const filters = JSON.parse(req.query.filters as string);
  const { error } = productFiltersSchema.validate(filters);
  if (error) {
    next(
      new AppError(
        error.details.map((err) => err.message).join(", "),
        StatusCodes.BAD_REQUEST
      )
    );
  }
  next();
};


