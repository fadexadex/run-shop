"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Trash2, ShoppingCart } from "lucide-react"

interface WishlistProduct {
  id: number
  dateAdded: string
  product: {
    id: number
    name: string
    price: number
    image: string
    category: string
  }
}

export default function Wishlist() {
  const [loading, setLoading] = useState(true)
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/wishlist")

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist")
        }

        const data = await response.json()
        setWishlistItems(data)
      } catch (err) {
        setError("Error loading wishlist. Please try again later.")
        console.error("Error fetching wishlist:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [])

  const removeFromWishlist = async (id: number) => {
    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWishlistItems(wishlistItems.filter((item) => item.id !== id))
      } else {
        throw new Error("Failed to remove item from wishlist")
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err)
      alert("Failed to remove item from wishlist. Please try again.")
    }
  }

  const handleBuyNow = async (productId: number) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          paymentMethod: "online",
        }),
      })

      if (response.ok) {
        alert("Order placed successfully! Redirecting to payment gateway...")
        // In a real app, this would redirect to a payment gateway
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || "Failed to place order"}`)
      }
    } catch (err) {
      console.error("Error placing order:", err)
      alert("Failed to place order. Please try again.")
    }
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600 mb-8">Items you&apos;ve saved for later</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden rounded-lg border">
                <Link href={`/product/${item.product.id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="object-cover transition-all hover:scale-105 h-48 w-full"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <Link href={`/product/${item.product.id}`} className="hover:underline">
                      <h3 className="font-semibold">{item.product.name}</h3>
                    </Link>
                    <p className="text-sm">{item.product.category}</p>
                    <p className="text-xs text-gray-500">Added on {new Date(item.dateAdded).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold">${item.product.price.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    className="flex-1 bg-black text-white"
                    size="sm"
                    onClick={() => handleBuyNow(item.product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => removeFromWishlist(item.id)} className="px-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600 mb-4">Your wishlist is empty.</p>
            <p className="text-gray-500 mb-6">Add items to your wishlist to save them for later.</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

