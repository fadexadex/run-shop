import Joi from "joi";

export const initiatePaymentSchema = Joi.object({
  email: Joi.string().email().required(), 
  name: Joi.string().required(),
  amount: Joi.number().positive().required(), 
  orderId: Joi.string().required(), 
});