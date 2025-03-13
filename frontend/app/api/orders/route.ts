import { NextResponse } from "next/server"
import { orders, products } from "@/lib/db"

// Mock current user - in a real app, this would come from authentication
const CURRENT_USER_ID = "user1"

export async function GET() {
  // Get orders for the current user
  const userOrders = orders.filter((order) => order.userId === CURRENT_USER_ID)

  // Get the full product details for each order
  const ordersWithProducts = userOrders.map((order) => {
    const product = products.find((p) => p.id === order.productId)
    return {
      ...order,
      product,
    }
  })

  return NextResponse.json(ordersWithProducts)
}

export async function POST(request: Request) {
  const { productId, quantity, paymentMethod } = await request.json()

  // Check if product exists
  const product = products.find((p) => p.id === productId)
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  // Check if product is in stock
  if (!product.inStock) {
    return NextResponse.json({ error: "Product is out of stock" }, { status: 400 })
  }

  // Create new order
  const newOrder = {
    id: orders.length + 1,
    userId: CURRENT_USER_ID,
    productId,
    quantity,
    status: paymentMethod === "online" ? "processing" : "pending",
    paymentMethod,
    createdAt: new Date().toISOString().split("T")[0],
  }

  orders.push(newOrder)

  return NextResponse.json(newOrder, { status: 201 })
}

