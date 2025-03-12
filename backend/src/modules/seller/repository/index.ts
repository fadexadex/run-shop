import { Prisma } from "@prisma/client";
import { prisma } from "../../../utils/db";
import { ICreateProduct } from "utils/types";

export class SellerRepository {
  async registerSeller(data: Prisma.SellerCreateInput, id: string) {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        role: "SELLER",
      },
    });
    return prisma.seller.create({
      data,
    });
  }

  async findSellerById(sellerId: string) {
    return prisma.seller.findUnique({
      where: {
        id: sellerId,
      },
    });
  }

  async getSellerCatalogue(sellerId: string) {
    return prisma.seller.findUnique({
      where: {
        id: sellerId,
      },
      include: {
        products: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async addProductToCatalogue(sellerId: string, data: ICreateProduct) {
    const { categoryId, ...productData } = data;
    return prisma.product.create({
      data: {
        ...productData,
        seller: {
          connect: {
            id: sellerId,
          },
        },
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async updateSeller(sellerId: string, data: Prisma.SellerUpdateInput) {
    return prisma.seller.update({
      where: {
        id: sellerId,
      },
      data,
    });
  }

  async listAllSellers() {
    return prisma.seller.findMany();
  }
}
