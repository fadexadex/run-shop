import { AuthService } from "../service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const authService = new AuthService();

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.register(req.body);
      res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.login(req.body);
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.getMe(req.user.email);


      res.status(StatusCodes.OK).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        shippingAddress: user.shippingAddress,
        email: user.email,
        role: user.role,
        sellerCompleted: !!user.seller,
      });
    } catch (error) {
      next(error);
    }
  };
}
