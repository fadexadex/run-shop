import { StatusCodes } from "http-status-codes";
import { ProductService } from "../service";

import { Request, Response, NextFunction } from "express";

const productService = new ProductService();

export class ProductController {
  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const filters = req.query.filters
        ? JSON.parse(req.query.filters as string)
        : {};

      const products = await productService.getAllProducts(
        page,
        limit,
        filters
      );

      res.status(StatusCodes.OK).json({
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const product = await productService.getProductById(id);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product not found",
        });
      }
      res.status(StatusCodes.OK).json({
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;
      const products = await productService.searchProducts(query);
      res.status(StatusCodes.OK).json({
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };
}
