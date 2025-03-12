import { Prisma, Product } from "@prisma/client";
import { prisma } from "../../../utils/db";

// POST /wishlist → Add product to wishlist
// GET /wishlist → Get user's wishlist
// DELETE /wishlist/:wishlist_id → Remove product from wishlist

export class WishListRepository {
  async createWishlist(userId: string) {
    return await prisma.wishlist.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async addProductToWishlist(wishListId: string, productId: string) {
    return await prisma.wishlistItem.create({
      data: {
        product: {
          connect: {
            id: productId,
          },
        },
        wishlist: {
          connect: {
            id: wishListId,
          },
        },
      },
    });
  }

  async removeProductFromWishList(productId: string, wishlistId: string) {
    return await prisma.wishlistItem.delete({
      where: {
        id: productId,
        wishlistId,
      },
    });
  }

  async getUserWishlist(userId: string) {
    return await prisma.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
