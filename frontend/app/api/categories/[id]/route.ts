import { NextResponse } from "next/server"
import { categories, products } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const categoryId = params.id

  // Find the category
  const category = categories.find((c) => c.id === categoryId)

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 })
  }

  // Find products in this category
  const categoryProducts = products.filter((p) => p.category.toLowerCase() === categoryId.toLowerCase())

  return NextResponse.json({
    category,
    products: categoryProducts,
  })
}

