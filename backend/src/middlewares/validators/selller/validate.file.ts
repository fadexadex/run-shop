import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../middlewares";
import { StatusCodes } from "http-status-codes";

export const validateFile = (req: Request, res: Response, next: NextFunction) => {
    if (!req.files.length || !req.files) {
        return next(new AppError("No file uploaded", StatusCodes.BAD_REQUEST));
    }
    next();
}