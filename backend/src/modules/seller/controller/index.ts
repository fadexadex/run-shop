import { SellerService } from "../service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../middlewares";
import fs from "fs";
import uploadImageToCloud from "../../../utils/cloudinary";

const sellerService = new SellerService();

export class SellerController {
  registerSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      req.body.userId = id;

      if (req.file.path) {
        req.body.cataloguePicture = await uploadImageToCloud(req.file.path);
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }

      const seller = await sellerService.registerSeller(req.body, id);
      res.status(StatusCodes.CREATED).json(seller);
    } catch (error) {
      if (error.code === "P2002") {
        next(new AppError("Seller already exists", StatusCodes.CONFLICT));
      }
      next(error);
    }
  };

  getSellerCatalogue = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const getSellerCatalogue = await sellerService.getSellerCatalogue(id);
      res.status(StatusCodes.OK).json(getSellerCatalogue);
    } catch (error) {
      next(error);
    }
  };

  addProductToCatalogue = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const files = req.files as Express.Multer.File[];
      const filePaths = files.map((file) => file.path);
      req.body.imageUrls = await Promise.all(
        filePaths.map(async (filePath: string) => {
          const url = await uploadImageToCloud(filePath);
          return url;
        })
      );
      const { id } = req.params;
      const product = await sellerService.addProductToCatalogue(id, req.body);
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Product has been added to catalogue", product });
    } catch (error) {
      next(error);
    }
  };

  updateSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file.path) {
        req.body.cataloguePicture = await uploadImageToCloud(req.file.path);
      }

      const seller = await sellerService.updateSeller(req.params.id, req.body);
      res
        .status(StatusCodes.OK)
        .json({ message: "Seller updated successfully", newDetails: seller });
    } catch (error) {
      if (error.code === "P2025") {
        next(new AppError("Seller not found", StatusCodes.NOT_FOUND));
      }
      next(error);
    }
  };

  listAllSellers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sellers = await sellerService.listAllSellers();
      res.status(StatusCodes.OK).json(sellers);
    } catch (error) {
      next(error);
    }
  };
}
