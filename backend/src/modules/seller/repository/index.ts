import { Prisma } from "@prisma/client";
import { prisma } from "../../../utils/db";
import { ICreateProduct, IUpdateProduct } from "utils/types";

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
    const seller =  await prisma.seller.create({
      data,
    });
    await prisma.wallet.create({
      data: {
        sellerId: seller.id, 
        balance: 0.0, 
        totalEarned: 0.0, 
      },
    });
    return seller;
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

  async getSellerAndWallet(orderId: string) {
    return prisma.seller.findFirst({
      where: {
        orders: {
          some: {
            id: orderId,
          },
        },
      },
      include: {
        wallet: {
          select: {
            id: true, 
          },
        },
      },
    });
  }

  async createTransaction(data: Prisma.TransactionCreateInput) {}

  updateProduct = async (id: string, data: IUpdateProduct) => {
    const { categoryId, ...productData } = data;

    return prisma.product.update({
      where: {
        id,
      },
      data: {
        ...productData,
        ...(categoryId && {
          category: {
            connect: {
              id: categoryId,
            },
          },
        }),
      },
    });
  };

  async deleteProduct(id: string) {
    return prisma.product.delete({
      where: {
        id,
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
