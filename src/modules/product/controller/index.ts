import { ProductService } from "../service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const productService = new ProductService();

export class ProductController {
  // Empty class
}