"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { categoriesApi } from "@/lib/api"

interface Category {
  id: string
  name: string
  products: any[]
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await categoriesApi.getAll()
        setCategories(response.data)
      } catch (err: any) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center mb-10">
            <h2 className="text-3xl font-bold md:text-4xl">Shop by Category</h2>
            <p className="mt-4 text-gray-600 max-w-2xl">
              Browse our wide range of products across different categories to find exactly what you need
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center mb-10">
            <h2 className="text-3xl font-bold md:text-4xl">Shop by Category</h2>
            <p className="mt-4 text-red-500">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2 className="text-3xl font-bold md:text-4xl">Shop by Category</h2>
          <p className="mt-4 text-gray-600 max-w-2xl">
            Browse our wide range of products across different categories to find exactly what you need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            // Get the first product image as category image or use placeholder
            const categoryImage =
              category.products &&
              category.products.length > 0 &&
              category.products[0].imageUrls &&
              category.products[0].imageUrls.length > 0
                ? category.products[0].imageUrls[0]
                : "/placeholder.svg?height=300&width=300"

            return (
              <Link href={`/category/${category.id}`} key={category.id} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={categoryImage || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.products ? `${category.products.length} products` : "No products yet"}
                    </p>
                    <div className="flex items-center text-black font-medium">
                      <span>Browse Category</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

