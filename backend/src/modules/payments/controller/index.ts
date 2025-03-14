import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../service";
import { StatusCodes } from "http-status-codes";

const paymentService = new PaymentService();

export class PaymentController {
  async initiatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, amount, orderId } = req.body;
      console.log(req.body);
      const paymentResponse = await paymentService.initiatePayment(
        email,
        name,
        amount,
        orderId
      );

      res.status(StatusCodes.OK).json({
        message: "Payment initiated successfully",
        data: paymentResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  // async handleWebHook(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     console.log(req.body);
  //     const { Body:{transaction_ref} } = req.body;

  //     await paymentService.handleWebHook(transaction_ref);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
