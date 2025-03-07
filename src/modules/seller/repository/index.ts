
import { Prisma } from "@prisma/client";
import { prisma } from "../../../utils/db";

export class SellerRepository {
  async registerSeller(data: Prisma.SellerCreateInput) {
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