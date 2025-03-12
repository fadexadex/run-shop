import { IUpdateUser } from "utils/types";
import { UserRepository } from "../repository";

const userRepo = new UserRepository();

export class UserService {
  getUserById = async (id: string) => {
    return userRepo.getUserById(id);
  };

  updateUser = async (id: string, data: IUpdateUser) => {
    return userRepo.updateUser(id, data);
  };

  deleteUser = async (id: string) => {
    return userRepo.deleteUser(id);
  };
}
