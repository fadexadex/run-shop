"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, ChevronRight, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createSlug } from "@/lib/mock-service"

interface Product {
  id: string
  name: string
  price: string
  imageUrls: string[]
  description: string
  stockQuantity: number
  sellerId: string
  seller: {
    id: string
    catalogueName: string
  }
}

interface Category {
  id: string
  name: string
  products: Product[]
}

export default function CategoryProductsSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // Fix the category products section to properly use mock data
    const fetchCategoriesWithDelay = async () => {
      try {
        setLoading(true)

        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Import mock data directly
        const { categories, products } = await import("@/lib/db")

        // Process each category to get its products
        const categoriesWithProducts = categories.map((category) => {
          // Get products for this category
          const categoryProducts = products.filter((product) => product.category === category.id)

          // Limit to 4 products per category for the home page
          const limitedProducts = categoryProducts.slice(0, 4)

          // Format products for display
          const formattedProducts = limitedProducts.map((product) => ({
            id: product.id.toString(),
            name: product.name,
            price: product.price.toString(),
            imageUrls: [product.image],
            description: product.description,
            stockQuantity: product.stockQuantity || Math.floor(Math.random() * 50) + 10,
            sellerId: product.seller.id.toString(),
            seller: {
              id: product.seller.id.toString(),
              catalogueName: product.seller.name,
            },
          }))

          // Return category with its products
          return {
            ...category,
            products: formattedProducts,
          }
        })

        // Filter out categories with no products
        const filteredCategories = categoriesWithProducts.filter(
          (category) => category.products && category.products.length > 0,
        )

        setCategories(filteredCategories)
        setLoading(false)
      } catch (err) {
        console.error("Error loading mock data:", err)
        setError("Failed to load categories and products")
        setLoading(false)
      }
    }

    // Simulate fetching wishlist data with delay
    const fetchWishlistWithDelay = async () => {
      if (user) {
        try {
          // Simulate a network delay
          await new Promise((resolve) => setTimeout(resolve, 800))

          // Mock wishlist data
          const mockWishlistItems = [1, 3, 5].map((id) => id.toString())
          setWishlist(mockWishlistItems)
        } catch (err) {
          console.error("Error with mock wishlist:", err)
        }
      }
    }

    fetchCategoriesWithDelay()
    fetchWishlistWithDelay()
  }, [user])

  // Toggle wishlist function
  const toggleWishlist = async (productId: string) => {
    if (!user) {
      window.location.href = "/auth?mode=login"
      return
    }

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (wishlist.includes(productId)) {
        // Remove from wishlist
        setWishlist(wishlist.filter((id) => id !== productId))
      } else {
        // Add to wishlist
        setWishlist([...wishlist, productId])
      }
    } catch (err) {
      console.error("Error updating wishlist:", err)
    }
  }

  if (loading) {
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600 mb-4">No categories or products found.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        {categories.map((category) => (
          <div key={category.id} className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{category.name}</h2>
              <Link
                href={`/category/${category.id}`}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-black"
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.products.map((product) => (
                <Card key={product.id} className="overflow-hidden rounded-lg border">
                  <Link href={`/product/${createSlug(product.name)}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          product.imageUrls && product.imageUrls.length > 0
                            ? product.imageUrls[0]
                            : "/placeholder.svg?height=200&width=200"
                        }
                        alt={product.name}
                        className="object-cover transition-all hover:scale-105 h-40 w-full"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Link href={`/product/${createSlug(product.name)}`} className="hover:underline">
                          <h3 className="font-semibold">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                        {product.seller && (
                          <Link href={`/seller/${product.seller.id}`} className="text-xs text-blue-600 hover:underline">
                            {product.seller.catalogueName}
                          </Link>
                        )}
                      </div>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-1.5 rounded-full ${wishlist.includes(product.id) ? "text-red-500" : "text-gray-400"}`}
                        aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart className="h-5 w-5" fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold">₦{Number.parseFloat(product.price).toFixed(2)}</span>
                      <span className="text-xs text-gray-500">
                        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/product/${createSlug(product.name)}`} className="w-full">
                      <Button className="w-full bg-black text-white" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {category.products.length > 4 && (
              <div className="flex justify-center mt-6">
                <Link href={`/category/${category.id}`}>
                  <Button variant="outline">View All {category.name}</Button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

