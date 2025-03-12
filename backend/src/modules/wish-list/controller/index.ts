import { WishListService } from "../service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const wishListService = new WishListService();

export class WishListController {
  addProductToWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, wishListId } = req.body;
      await wishListService.addProductToWishlist(wishListId, productId);
      res.status(StatusCodes.CREATED).json({ message: "Product added to wishlist" });
    } catch (error) {
      next(error);
    }
  };

  removeProductFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, wishListId } = req.body;
      await wishListService.removeProductFromWishlist(productId, wishListId);
      res.status(StatusCodes.OK).json({ message: "Product removed from wishlist" });
    } catch (error) {
      next(error);
    }
  };

  getUserWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const wishlist = await wishListService.getUserWishlist(id);
      res.status(StatusCodes.OK).json(wishlist);
    } catch (error) {
      next(error);
    }
  };
}
