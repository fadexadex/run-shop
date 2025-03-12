import { IUpdateProduct, ProductFilters } from "utils/types";
import { ProductRepository } from "../repository";

const productRepository = new ProductRepository();

export class ProductService {
  getAllProducts = async (page: number, limit: number, filters: ProductFilters) => {
    const skip = (page - 1) * limit;

    const { products, count } = await productRepository.getAllProducts(
      skip,
      limit, filters
    );

    return {
      products,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  };

  getProductById = async (id: string) => {
    return productRepository.getProductById(id);
  };

  updateProduct = async (id: string, data: IUpdateProduct) => {
    return productRepository.updateProduct(id, data);
  };

  deleteProduct = async (id: string) => {
    return productRepository.deleteProduct(id);
  };
}
