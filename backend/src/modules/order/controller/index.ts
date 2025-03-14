import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { OrderService } from "../service";
import EmailService from "../../../utils/nodemailer";

const orderService = new OrderService();
const emailService = new EmailService();

export class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
        data.userId = req.user.id;
      const order = await orderService.createOrder(data);

      setImmediate(async () => {
        // const sellerEmail = order.orderItems[0]?.product?.seller?.user?.email || null;
        if (true) {
          await emailService.sendOrderNotification("fadehandaniel2006@gmail.com", order);
        }
      });

      res.status(StatusCodes.CREATED).json(order);
    } catch (error) {
      next(error);
    }
  }
}
