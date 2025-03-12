import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares";
import authRoutes from "./modules/auth/routes";
import userRoutes from "./modules/user/routes";
import sellerRoutes from "./modules/seller/routes";
import categoryRoutes from "./modules/category/routes";
import productRoutes from "./modules/product/routes";
import wishListRoutes from "./modules/wish-list/routes";
import cors from "cors";

dotenv.config();

export class Server {
  private app: express.Application;
  private port: number;
  private apiRouter: express.Router;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.apiRouter = express.Router();
  }

  private enableMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(errorHandler);
  }

  private setUpRoutes() {
    this.apiRouter.use("/auth", authRoutes);
    this.apiRouter.use("/users", userRoutes);
    this.apiRouter.use("/sellers", sellerRoutes);
    this.apiRouter.use("/categories", categoryRoutes);
    this.apiRouter.use("/products", productRoutes);
    this.apiRouter.use("/wish-lists", wishListRoutes);
    this.app.use("/api/v1", this.apiRouter);
    this.app.use(errorHandler);
  }

  public startApp() {
    this.enableMiddlewares();
    this.setUpRoutes();
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
