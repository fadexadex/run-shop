"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Trash2, ShoppingCart, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface WishlistProduct {
  id: string
  name: string
  price: string
  imageUrls: string[]
  description: string
  category: {
    id: string
    name: string
  }
  seller: string
}

// Helper function to create a slug from product name
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function Wishlist() {
  const [loading, setLoading] = useState(true)
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([])
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Import mock data
        const { products } = await import("@/lib/db")

        // Mock wishlist items (products with IDs 1, 3, 5)
        const wishlistProductIds = [1, 3, 5]
        const wishlistProducts = products
          .filter((product) => wishlistProductIds.includes(product.id))
          .map((product) => ({
            id: product.id.toString(),
            name: product.name,
            price: product.price.toString(),
            imageUrls: [product.image],
            description: product.description,
            category: {
              id: product.category,
              name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
            },
            seller: product.seller,
          }))

        setWishlistItems(wishlistProducts)
      } catch (err) {
        console.error("Error fetching wishlist:", err)
        setError("Failed to load wishlist")
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user])

  const removeFromWishlist = async (id: string) => {
    try {
      setWishlistItems(wishlistItems.filter((item) => item.id !== id))

      // const response = await fetch(`/api/wishlist/${id}`, {
      //   method: "DELETE",
      // })

      // if (!response.ok) {
      //   // If the API call fails, revert the UI change
      //   const data = await response.json()
      //   throw new Error(data.error || "Failed to remove item from wishlist")
      // }
    } catch (err: any) {
      console.error("Error removing from wishlist:", err)
      // Refetch the wishlist to restore the correct state
      // const response = await fetch("/api/wishlist")
      // if (response.ok) {
      //   const data = await response.json()
      //   setWishlistItems(data)
      // }
      alert(err.message || "Failed to remove item from wishlist. Please try again.")
    }
  }

  const handleBuyNow = async (productId: number) => {
    try {
      // const response = await fetch("/api/orders", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     productId,
      //     quantity: 1,
      //     paymentMethod: "online",
      //   }),
      // })

      // if (response.ok) {
      alert("Order placed successfully! Redirecting to payment gateway...")
      // In a real app, this would redirect to a payment gateway
      // } else {
      //   const error = await response.json()
      //   alert(`Error: ${error.error || "Failed to place order"}`)
      // }
    } catch (err) {
      console.error("Error placing order:", err)
      alert("Failed to place order. Please try again.")
    }
  }

  if (!user) {
    return (
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
            <AlertCircle className="h-12 w-12 text-[#008ECC] mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to view your wishlist.</p>
            <Link href="/auth?mode=login">
              <Button className="bg-[#008ECC] hover:bg-[#007bb3] text-white">Log In</Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#008ECC] hover:bg-[#007bb3] text-white">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-600">Items you've saved for later</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-[#008ECC]" />
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden rounded-lg border hover:shadow-md transition-shadow">
                <Link href={`/product/${createSlug(item.name)}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.imageUrls[0] || "/placeholder.svg?height=200&width=200"}
                      alt={item.name}
                      className="object-cover transition-all hover:scale-105 h-40 w-full"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <Link href={`/product/${createSlug(item.name)}`} className="hover:underline">
                      <h3 className="font-semibold">{item.name}</h3>
                    </Link>
                    <p className="text-sm">{item.category.name}</p>
                    {/* <p className="text-xs text-gray-500">Added on {new Date(item.dateAdded).toLocaleDateString()}</p> */}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-[#008ECC]">${Number.parseFloat(item.price).toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    className="flex-1 bg-[#008ECC] hover:bg-[#007bb3] text-white"
                    size="sm"
                    onClick={() => handleBuyNow(Number.parseInt(item.id))}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromWishlist(item.id)}
                    className="px-2 border-red-300 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="max-w-md mx-auto">
              <img
                src="/placeholder.svg?height=150&width=150"
                alt="Empty wishlist"
                className="mx-auto mb-6 h-32 w-32 opacity-50"
              />
              <p className="text-xl text-gray-600 mb-4">Your wishlist is empty.</p>
              <p className="text-gray-500 mb-6">Add items to your wishlist to save them for later.</p>
              <Link href="/products">
                <Button className="bg-[#008ECC] hover:bg-[#007bb3] text-white">Browse Products</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

