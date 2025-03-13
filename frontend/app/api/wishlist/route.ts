import { NextResponse } from "next/server"
import { wishlistItems, products } from "@/lib/db"

// Mock current user - in a real app, this would come from authentication
const CURRENT_USER_ID = "user1"

export async function GET() {
  // Get wishlist items for the current user
  const userWishlist = wishlistItems.filter((item) => item.userId === CURRENT_USER_ID)

  // Get the full product details for each wishlist item
  const wishlistWithProducts = userWishlist.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    return {
      id: item.id,
      dateAdded: item.dateAdded,
      product,
    }
  })

  return NextResponse.json(wishlistWithProducts)
}

export async function POST(request: Request) {
  const { productId } = await request.json()

  // Check if product exists
  const product = products.find((p) => p.id === productId)
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  // Check if item is already in wishlist
  const existingItem = wishlistItems.find((item) => item.productId === productId && item.userId === CURRENT_USER_ID)

  if (existingItem) {
    return NextResponse.json({ error: "Item already in wishlist" }, { status: 400 })
  }

  // Add to wishlist
  const newItem = {
    id: wishlistItems.length + 1,
    productId,
    userId: CURRENT_USER_ID,
    dateAdded: new Date().toISOString().split("T")[0],
  }

  wishlistItems.push(newItem)

  return NextResponse.json(newItem, { status: 201 })
}

