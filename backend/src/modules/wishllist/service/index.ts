import { Prisma } from "@prisma/client";
import { WishListRepository } from "../repository";


const wishListRepo = new WishListRepository();

export class WishListService {
  async createWishlist(userId: string) {
    return await wishListRepo.createWishlist(userId);
  }
}
