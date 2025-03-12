import { Request, Response, NextFunction } from "express";
export const parseQuantityAndPrice = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.price = parseFloat(req.body.price);
  req.body.stockQuantity = parseInt(req.body.stockQuantity);
  next();
};
