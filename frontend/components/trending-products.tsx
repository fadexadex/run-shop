"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Hardcoded trending products for performance
const trendingProducts = [
  {
    id: "1",
    name: "Oraimo Earpods",
    price: "59.99",
    image: "/placeholder.svg?height=400&width=300",
    category: "Electronics",
    seller: "Tech Hub",
  },
  {
    id: "2",
    name: "Campus Hoodie",
    price: "29.99",
    image: "/placeholder.svg?height=400&width=300",
    category: "Clothing",
    seller: "Campus Threads",
  },
  {
    id: "3",
    name: "Jollof Rice Special",
    price: "5.99",
    image: "/placeholder.svg?height=400&width=300",
    category: "Food",
    seller: "Campus Eats",
  },
  {
    id: "4",
    name: "Laptop Backpack",
    price: "39.99",
    image: "/placeholder.svg?height=400&width=300",
    category: "Accessories",
    seller: "Style Hub",
  },
]

export default function TrendingProducts() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // Simulate fetching wishlist
    if (user) {
      // In a real app, this would be an API call
      setWishlist(["2", "3"])
    }
  }, [user])

  const toggleWishlist = (productId: string) => {
    if (!user) {
      window.location.href = "/auth?mode=login"
      return
    }

    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId))
    } else {
      setWishlist([...wishlist, productId])
    }
  }

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2 className="text-3xl font-bold md:text-4xl">Trending Now</h2>
          <p className="mt-4 text-gray-600 max-w-2xl">Discover what other students are buying on campus right now</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden rounded-lg border">
              <Link href={`/product/${product.id}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
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
                    <p className="text-sm">{product.category}</p>
                    <p className="text-xs text-gray-500">{product.seller}</p>
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
                  <span className="font-bold">₦{product.price}</span>
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

        <div className="flex justify-center mt-10">
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

