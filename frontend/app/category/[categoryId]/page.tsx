"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { useParams } from "next/navigation"
import { categoriesApi, wishlistApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

interface Product {
  id: string
  name: string
  price: string
  imageUrls: string[]
  stockQuantity: number
}

interface Category {
  id: string
  name: string
  products: Product[]
}

export default function CategoryProducts() {
  const params = useParams()
  const categoryId = params.categoryId as string

  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true)
      try {
        const response = await categoriesApi.getCategoryProducts(categoryId)
        setCategory(response.data)
      } catch (error) {
        setError("Error loading category products. Please try again later.")
        console.error("Error fetching category products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategoryProducts()
    }
  }, [categoryId])

  useEffect(() => {
    // Fetch wishlist if user is logged in
    const fetchWishlist = async () => {
      if (!user) return

      try {
        const response = await wishlistApi.getWishlist()
        if (response && response.data) {
          setWishlist(response.data.map((item: any) => item.productId))
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err)
      }
    }

    fetchWishlist()
  }, [user])

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      // Redirect to login if not logged in
      window.location.href = "/login"
      return
    }

    try {
      if (wishlist.includes(productId)) {
        await wishlistApi.removeFromWishlist(productId)
        setWishlist(wishlist.filter((id) => id !== productId))
      } else {
        await wishlistApi.addToWishlist(productId)
        setWishlist([...wishlist, productId])
      }
    } catch (err) {
      console.error("Error updating wishlist:", err)
    }
  }

  if (loading) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{error || "Category Not Found"}</h2>
        <p className="mb-6">The category you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/categories" className="text-sm text-gray-500 hover:underline mb-4 inline-block">
            &larr; All Categories
          </Link>
          <h1 className="text-3xl font-bold mt-2">{category.name}</h1>
          <p className="text-gray-600 mt-2">Browse our selection of {category.name} products</p>
        </div>

        {category.products && category.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <Card key={product.id} className="overflow-hidden rounded-lg border">
                <Link href={`/product/${product.id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        product.imageUrls && product.imageUrls.length > 0
                          ? product.imageUrls[0]
                          : "/placeholder.svg?height=400&width=300"
                      }
                      alt={product.name}
                      className="object-cover transition-all hover:scale-105 h-48 w-full"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Link href={`/product/${product.id}`} className="hover:underline">
                        <h3 className="font-semibold">{product.name}</h3>
                      </Link>
                      <p className="text-sm">
                        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
                      </p>
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
                    <span className="font-bold">${Number.parseFloat(product.price).toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/product/${product.id}`} className="w-full">
                    <Button className="w-full bg-black text-white" size="sm">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products found in this category.</p>
            <Link href="/products" className="mt-4 inline-block">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

