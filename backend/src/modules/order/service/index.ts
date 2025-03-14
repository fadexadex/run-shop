import { ICreateOrder } from "utils/types";
import { OrderRepository } from "../repository";

const orderRepository = new OrderRepository();

export class OrderService {
  async createOrder(data: ICreateOrder) {
    return await orderRepository.createOrder(data);
  }
}
