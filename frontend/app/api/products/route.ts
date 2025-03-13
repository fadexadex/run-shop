import { NextResponse } from "next/server"
import { products } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Get query parameters
  const query = searchParams.get("q")
  const category = searchParams.get("category")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const seller = searchParams.get("seller")

  let filteredProducts = [...products]

  // Apply search query filter
  if (query) {
    const searchTerm = query.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm),
    )
  }

  // Apply category filter
  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
  }

  // Apply price range filter
  if (minPrice) {
    filteredProducts = filteredProducts.filter((product) => product.price >= Number.parseFloat(minPrice))
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter((product) => product.price <= Number.parseFloat(maxPrice))
  }

  // Apply seller filter
  if (seller && seller !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.seller.name.toLowerCase() === seller.toLowerCase())
  }

  return NextResponse.json(filteredProducts)
}

