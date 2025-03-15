import { NextResponse } from "next/server"
import { mockProductsService } from "@/lib/mock-service"

export async function GET(request: Request) {
  // Get the search query from the URL
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  try {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Use the mock service to search products
    const products = await mockProductsService.searchProducts(query)

    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ success: false, error: "Failed to search products" }, { status: 500 })
  }
}

