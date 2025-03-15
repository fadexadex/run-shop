"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Trash2, ShoppingCart } from "lucide-react"

// Helper function to create a slug from product name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function Wishlist() {
  const [loading, setLoading] = useState(true)
  const [wishlistItems, setWishlistItems] = useState([])

  // Mock data for demonstration
  const mockWishlistItems = [
    {
      id: 1,
      name: "T-Shirt",
      price: 9.99,
      image: "/product-3.jpg?height=400&width=300",
      category: "Clothing",
      dateAdded: "2023-11-15",
    },
    {
      id: 3,
      name: "Jewellery Set",
      price: 29.99,
      image: "/product-3.jpg?height=400&width=300",
      category: "Accessories",
      dateAdded: "2023-11-10",
    },
    {
      id: 5,
      name: "Laptop Bag",
      price: 24.99,
      image: "/product-2.jpg?height=400&width=300",
      category: "Accessories",
      dateAdded: "2023-11-05",
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWishlistItems(mockWishlistItems)
      setLoading(false)
    }, 500)
  }, [])

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id))
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600 mb-8">Items you've saved for later</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden rounded-lg border">
                <Link to={`/product/${createSlug(item.name)}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="object-cover transition-all hover:scale-105 h-48 w-full"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <Link to={`/product/${createSlug(item.name)}`} className="hover:underline">
                      <h3 className="font-semibold">{item.name}</h3>
                    </Link>
                    <p className="text-sm">{item.category}</p>
                    <p className="text-xs text-gray-500">Added on {new Date(item.dateAdded).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold">₦{Number.parseFloat(item.price).toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button className="flex-1 bg-black text-white" size="sm">
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
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

