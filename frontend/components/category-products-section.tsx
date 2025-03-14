"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, ChevronRight, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

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

// Helper function to create a slug from product name
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function CategoryProductsSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)

        // Use hardcoded fallback data immediately for faster initial rendering
        const fallbackCategories = [
          {
            id: "b38346bd-feca-406e-ac43-8bb107f09031",
            name: "Accessories",
            products: [
              {
                id: "3970c0e2-a929-46f6-9c90-72cd7930c185",
                name: "Anker Soundcore Life Q20",
                description: "Hybrid Active Noise Cancelling over-ear headphones with Hi-Res audio.",
                price: "79.99",
                stockQuantity: 150,
                imageUrls: ["https://res.cloudinary.com/dwl6lr9vq/image/upload/v1741805573/yrc23llqxj1odwvz0r2h.webp"],
                sellerId: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                seller: {
                  id: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                  catalogueName: "Dima Stores",
                },
              },
              {
                id: "4970c0e2-a929-46f6-9c90-72cd7930c186",
                name: "Wireless Earbuds",
                description: "Bluetooth 5.0 wireless earbuds with noise cancellation.",
                price: "49.99",
                stockQuantity: 75,
                imageUrls: ["/placeholder.svg?height=200&width=200"],
                sellerId: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                seller: {
                  id: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                  catalogueName: "Dima Stores",
                },
              },
            ],
          },
          {
            id: "c38346bd-feca-406e-ac43-8bb107f09032",
            name: "Electronics",
            products: [
              {
                id: "5970c0e2-a929-46f6-9c90-72cd7930c187",
                name: "Smartphone Power Bank",
                description: "20000mAh high capacity power bank with fast charging.",
                price: "39.99",
                stockQuantity: 100,
                imageUrls: ["/placeholder.svg?height=200&width=200"],
                sellerId: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                seller: {
                  id: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                  catalogueName: "Dima Stores",
                },
              },
              {
                id: "6970c0e2-a929-46f6-9c90-72cd7930c188",
                name: "Bluetooth Speaker",
                description: "Portable waterproof Bluetooth speaker with 24-hour battery life.",
                price: "59.99",
                stockQuantity: 50,
                imageUrls: ["/placeholder.svg?height=200&width=200"],
                sellerId: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                seller: {
                  id: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                  catalogueName: "Dima Stores",
                },
              },
            ],
          },
          {
            id: "d38346bd-feca-406e-ac43-8bb107f09033",
            name: "Clothing",
            products: [
              {
                id: "7970c0e2-a929-46f6-9c90-72cd7930c189",
                name: "Campus Hoodie",
                description: "Comfortable cotton hoodie with university logo.",
                price: "29.99",
                stockQuantity: 200,
                imageUrls: ["/placeholder.svg?height=200&width=200"],
                sellerId: "d8d1f69f-201e-4cb4-935b-4b5d3da97aec",
                seller: {
                  id: "d8d1f69f-201e-4cb4-935b-4b5d3da97aec",
                  catalogueName: "Campus Threads",
                },
              },
              {
                id: "8970c0e2-a929-46f6-9c90-72cd7930c190",
                name: "Graphic T-Shirt",
                description: "100% cotton t-shirt with trendy graphic design.",
                price: "19.99",
                stockQuantity: 150,
                imageUrls: ["/placeholder.svg?height=200&width=200"],
                sellerId: "d8d1f69f-201e-4cb4-935b-4b5d3da97aec",
                seller: {
                  id: "d8d1f69f-201e-4cb4-935b-4b5d3da97aec",
                  catalogueName: "Campus Threads",
                },
              },
            ],
          },
        ]

        // Set categories immediately with fallback data
        setCategories(fallbackCategories)
        setLoading(false)

        // Then try to fetch from API in the background
        try {
          const response = await fetch("http://localhost:6160/api/v1/categories").catch((err) => {
            console.error("Network error fetching categories:", err)
            return null
          })

          if (response && response.ok) {
            const data = await response.json()

            // Process API data in the background
            const categoriesWithProducts = await Promise.all(
              data.data.map(async (category: any) => {
                try {
                  const productsResponse = await fetch(
                    `http://localhost:6160/api/v1/categories/${category.id}/products`,
                  ).catch((err) => {
                    console.error(`Network error fetching products for category ${category.id}:`, err)
                    return null
                  })

                  if (!productsResponse || !productsResponse.ok) {
                    return {
                      ...category,
                      products: [],
                    }
                  }

                  const productsData = await productsResponse.json()
                  return {
                    ...category,
                    products: productsData.data || [],
                  }
                } catch (error) {
                  console.error(`Error fetching products for category ${category.id}:`, error)
                  return {
                    ...category,
                    products: [],
                  }
                }
              }),
            )

            // Filter out categories with no products
            const filteredCategories = categoriesWithProducts.filter(
              (category: Category) => category.products && category.products.length > 0,
            )

            // Only update if we got valid data
            if (filteredCategories.length > 0) {
              setCategories(filteredCategories)
            }
          }
        } catch (err) {
          console.error("Error fetching categories in background:", err)
          // Keep using fallback data, no need to update error state
        }
      } catch (err) {
        console.error("Error in category products section:", err)
        setError("Failed to load categories and products")
      }
    }

    // Fetch wishlist if user is logged in
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await fetch("http://localhost:6160/api/v1/wishlist").catch((err) => {
            console.error("Network error fetching wishlist:", err)
            return null
          })

          if (response && response.ok) {
            const data = await response.json()
            setWishlist(data.data.map((item: any) => item.productId))
          }
        } catch (err) {
          console.error("Error fetching wishlist:", err)
        }
      }
    }

    fetchCategories()
    fetchWishlist()
  }, [user])

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      window.location.href = "/auth?mode=login"
      return
    }

    try {
      if (wishlist.includes(productId)) {
        // Remove from wishlist
        await fetch(`http://localhost:6160/api/v1/wishlist/${productId}`, {
          method: "DELETE",
        })
        setWishlist(wishlist.filter((id) => id !== productId))
      } else {
        // Add to wishlist
        await fetch("http://localhost:6160/api/v1/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        })
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
              {category.products.slice(0, 4).map((product) => (
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
                      <span className="font-bold">${Number.parseFloat(product.price).toFixed(2)}</span>
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

