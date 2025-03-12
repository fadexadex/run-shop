import { Prisma, PrismaClient } from "@prisma/client";
import {  IUpdateProduct, ProductFilters } from "utils/types";
import { prisma } from "../../../utils/db";

export class ProductRepository {
  getAllProducts = async (skip: number, take: number, filters: ProductFilters) => {
    const [products, count] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: true,
        },
        where: filters
        
      }),
      prisma.product.count(),
    ]);

    return { products, count };
  };

  getProductById = async (id: string) => {
    return prisma.product.findUnique({
      where: {
        id,
      },
    });
  };


}
