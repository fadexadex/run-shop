import Joi from "joi";
import { PaymentMethod } from "@prisma/client";

export const validateId = Joi.object({
  user_id: Joi.string().required(),
});

export const registerSellerSchema = Joi.object({
  catalogueName: Joi.string().required(),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .required(),
});

export const updateSellerSchema = Joi.object({
  catalogueName: Joi.string().optional(),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .optional(),
});

export const addProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),

  stockQuantity: Joi.number().required(),
  categoryId: Joi.string().required(),
});
