import { AuthService } from "../service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { WishListService } from "../../../modules/wish-list/service";
import { verifyToken } from "../../../utils/jwt";

const authService = new AuthService();
const wishListService = new WishListService();

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.register(req.body);
      setImmediate(async () => {
        const id = verifyToken(user.token).id;
        await wishListService.createWishlist(id);
      });
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
      const { password, ...data } = user;

      res.status(StatusCodes.OK).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
