"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { productsApi, wishlistApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

interface Product {
  id: string
  name: string
  price: string
  imageUrls: string[]
  category: {
    id: string
    name: string
  }
}

// Helper function to create a slug from product name
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productsApi.getAll({ limit: 4 })
        setProducts(response.data.products)
      } catch (err: any) {
        console.error("Error fetching products:", err)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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
      <section className="w-full py-6 md:py-8 lg:py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full py-6 md:py-8 lg:py-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-6 md:py-8 lg:py-16 flex items-center justify-center">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold md:text-4xl">Featured Products</h2>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto mt-4 mb-8">
              Discover our most popular items loved by Redeemer&apos;s University students
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden rounded-lg border">
              <Link href={`/product/${createSlug(product.name)}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={
                      product.imageUrls && product.imageUrls.length > 0
                        ? product.imageUrls[0]
                        : "/placeholder.svg?height=400&width=300"
                    }
                    alt={product.name}
                    className="object-cover transition-all hover:scale-105 h-48 w-full"
                    width={300}
                    height={400}
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Link href={`/product/${createSlug(product.name)}`} className="hover:underline">
                      <h3 className="font-semibold tracking-tight">{product.name}</h3>
                    </Link>
                    <p className="text-sm">{product.category?.name || "Uncategorized"}</p>
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
                <Link href={`/product/${createSlug(product.name)}`} className="w-full">
                  <Button className="w-full bg-black text-white" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="/products">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

