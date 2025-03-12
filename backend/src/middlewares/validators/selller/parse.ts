import { Request, Response, NextFunction } from "express";

export const parseQuantityAndPrice = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.price !== undefined) {
    req.body.price = parseFloat(req.body.price);
  }
  if (req.body.stockQuantity !== undefined) {
    req.body.stockQuantity = parseInt(req.body.stockQuantity);
  }
  next();
};
