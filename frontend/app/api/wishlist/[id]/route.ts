import { NextResponse } from "next/server"
import { wishlistItems } from "@/lib/db"

// Mock current user - in a real app, this would come from authentication
const CURRENT_USER_ID = "user1"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  // Find the wishlist item
  const itemIndex = wishlistItems.findIndex((item) => item.id === id && item.userId === CURRENT_USER_ID)

  if (itemIndex === -1) {
    return NextResponse.json({ error: "Wishlist item not found" }, { status: 404 })
  }

  // Remove from wishlist
  wishlistItems.splice(itemIndex, 1)

  return NextResponse.json({ success: true })
}

