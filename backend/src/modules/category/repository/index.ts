import { Prisma } from "@prisma/client";
import { prisma } from "../../../utils/db";

export class CategoryRepository {
  createCategory = async (data: Prisma.CategoryCreateInput) => {
    return prisma.category.create({
      data,
    });
  };

  getOnlyCategories = async () => {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  getAllCategories = async () => {
    return prisma.category.findMany({
      include: {
        products: {
          take: 4,
        },
      },
    });
  };

  getCategoryProducts = async (id: string) => {
    return prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });
  };

  updateCategory = async (id: string, data: Prisma.CategoryUpdateInput) => {
    return prisma.category.update({
      where: {
        id,
      },
      data,
    });
  };

  deleteCategory = async (id: string) => {
    return prisma.category.delete({
      where: {
        id,
      },
    });
  };
}
