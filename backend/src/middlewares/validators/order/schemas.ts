import Joi from "joi";
import { OrderStatus, PaymentMethod, EscrowStatus } from "@prisma/client"; // Import Prisma enums

export const orderSchema = Joi.object({
  sellerId: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().positive().required(),
  orderStatus: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required(),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .required(),
  escrowStatus: Joi.string()
    .valid(...Object.values(EscrowStatus))
    .required(),
  hostelName: Joi.string().required(), 
  blockNumber: Joi.number().integer().required(),
  roomNo: Joi.number().integer().required(), 
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required(),
});

export const orderIdSchema = Joi.object({
  id: Joi.string().required(),
});

export const userIdSchema = Joi.object({
  userId: Joi.string().required(),
});
