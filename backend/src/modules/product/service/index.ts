import { ProductRepository } from "../repository";
import { Prisma } from "@prisma/client";
import { AppError } from "../../../middlewares/error.handler";
import { StatusCodes } from "http-status-codes";

const productRepo = new ProductRepository();

export class ProductService {

}