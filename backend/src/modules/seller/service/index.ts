import { ICreateProduct, IUpdateProduct } from "utils/types";
import { SellerRepository } from "../repository";
import { Prisma } from "@prisma/client";

const sellerRepo = new SellerRepository();

export class SellerService {
  registerSeller = async (data: Prisma.SellerCreateInput, id: string) => {
    return sellerRepo.registerSeller(data, id);
  };

  getSellerCatalogue = async (sellerId: string) => {
    return sellerRepo.getSellerCatalogue(sellerId);
  };

  addProductToCatalogue = async (
    sellerId: string,
    data: ICreateProduct
  ) => {
    return sellerRepo.addProductToCatalogue(sellerId, data);
  };

  updateProduct = async (id: string, data: IUpdateProduct) => {
    return sellerRepo.updateProduct(id, data);
  }

  deleteProduct = async (id: string) => {

    return sellerRepo.deleteProduct(id);
  }

  updateSeller = async (sellerId: string, data: Prisma.SellerUpdateInput) => {
    return sellerRepo.updateSeller(sellerId, data);
  };

  listAllSellers = async () => {
    return sellerRepo.listAllSellers();
  };
}
