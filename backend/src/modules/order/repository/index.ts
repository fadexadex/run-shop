import { Prisma } from "@prisma/client";
import { prisma } from "../../../utils/db";
import { ICreateOrder } from "../../../utils/types";
import { IOrderStatus } from "../../../utils/types";

export class OrderRepository {
  async createOrder(data: ICreateOrder) {
    const { userId, sellerId, items, ...orderData } = data;

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        price: true,
        stockQuantity: true,
        sellerId: true, 
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product with ID ${item.productId} not found`);
      if (product.stockQuantity < item.quantity)
        throw new Error(`Not enough stock for product ${item.productId}`);

      return {
        quantity: item.quantity,
        price: product.price,
        product: { connect: { id: item.productId } },
      };
    });

    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          ...orderData,
          user: { connect: { id: userId } },
          seller: { connect: { id: sellerId } },
          orderItems: { create: orderItems },
        },
        select: {
          id: true,
          totalPrice: true,
          orderStatus: true,
          paymentMethod: true,
          escrowStatus: true,
          createdAt: true,
          orderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  seller: {
                    select: {
                      user: {
                        select: {
                          email: true, 
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return order;
    });
  }

  async updateOrderStatus(id: string, orderStatus: IOrderStatus) {
    return await prisma.order.update({
      where: {
        id,
      },
      data: {
        orderStatus,
      },
    });
  }
}
