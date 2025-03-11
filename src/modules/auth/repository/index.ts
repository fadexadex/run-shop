import { Prisma } from "@prisma/client";
import { prisma } from "../../../utils/db";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async registerUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  async getMe(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        seller: true,
      },
    });
  }
}
