"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { useParams } from "next/navigation"

export default function CategoryProducts() {
  const params = useParams()
  const categoryId = params.categoryId as string

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState<number[]>([])

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data for demonstration
        const allProducts = [
          {
            id: 1,
            name: "T-Shirt",
            price: 9.99,
            image: "/placeholder.svg?height=400&width=300",
            category: "clothing",
          },
          {
            id: 2,
            name: "Cross Bag",
            price: 19.99,
            image: "/placeholder.svg?height=400&width=300",
            category: "accessories",
          },
          {
            id: 3,
            name: "Jewellery Set",
            price: 29.99,
            image: "/placeholder.svg?height=400&width=300",
            category: "accessories",
          },
          {
            id: 4,
            name: "Jollof Rice",
            price: 5.99,
            image: "/placeholder.svg?height=400&width=300",
            category: "food",
          },
          {
            id: 5,
            name: "Laptop Bag",
            price: 24.99,
            image: "/placeholder.svg?height=400&width=300",
            category: "accessories",
          },
          {
            id: 6,
            name: "Fried Rice",
            price: 6.99,
            image: "/placeholder.svg?height=400&width=300",
            category: "food",
          },
        ]

        const filtered = allProducts.filter((product) => product.category === categoryId)
        setProducts(filtered)
      } catch (error) {
        console.error("Error fetching category products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategoryProducts()
    }
  }, [categoryId])

  const formatCategoryName = (id: string) => {
    return id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((itemId) => itemId !== id))
    } else {
      setWishlist([...wishlist, id])
    }
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/categories" className="text-sm text-gray-500 hover:underline mb-4 inline-block">
            &larr; All Categories
          </Link>
          <h1 className="text-3xl font-bold mt-2">{formatCategoryName(categoryId)}</h1>
          <p className="text-gray-600 mt-2">Browse our selection of {formatCategoryName(categoryId)} products</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
                    <span className="font-bold">${product.price.toFixed(2)}</span>
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

