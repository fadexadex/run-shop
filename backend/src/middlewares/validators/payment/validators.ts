import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { initiatePaymentSchema } from "./schemas";
import { AppError } from "../../../middlewares/error.handler";

export const validateInitiatePayment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = initiatePaymentSchema.validate(req.body);
  if (error) {
    return next(
      new AppError(
        error.details.map((err) => err.message).join(", "),
        StatusCodes.BAD_REQUEST
      )
    );
  }
  next();
};