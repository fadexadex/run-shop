import { UserService } from "../service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const userService = new UserService();

export class UserController {
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.params;
      const user = await userService.getUserById(user_id);

      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "User not found" });
      }

      const { password, ...safeDetails } = user;

      res.status(StatusCodes.OK).json(safeDetails);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userService.updateUser(req.user.id, req.body);

      res.status(StatusCodes.OK).json({ message: "User updated successfully" });
    } catch (error) {
      next(error);
    }
  };

}
