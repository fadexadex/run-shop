import { Request, Response, NextFunction } from "express";
import { validateId } from "./schemas";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../middlewares/error.handler";

export const idValidator = async (
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
