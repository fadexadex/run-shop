import { Prisma } from "@prisma/client";
import { WishListRepository } from "../repository";

const wishListRepo = new WishListRepository();

export class WishListService {
  async createWishlist(userId: string) {
    return await wishListRepo.createWishlist(userId);
  }

  async addProductToWishlist(wishListId: string, productId: string) {
    return await wishListRepo.addProductToWishlist(wishListId, productId);
  }

  async removeProductFromWishlist(productId: string, wishlistId: string) {
    return await wishListRepo.removeProductFromWishList(productId, wishlistId);
  }

  async getUserWishlist(userId: string) {
    return await wishListRepo.getUserWishlist(userId);
  }
}
