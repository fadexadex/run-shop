import { Prisma } from "@prisma/client";
import { prisma } from "../../../utils/db";
import { IUpdateUser } from "utils/types";

export class UserRepository {
  getUserById = async (id: string) => {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  };

  updateUser = async (id: string, data: IUpdateUser) => {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  };

  deleteUser = async (id: string) => {
    return prisma.user.delete({
      where: {
        id,
      },
    });
  };
}
