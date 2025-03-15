"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, ArrowLeft, Loader2, Store, ShoppingBag, Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  price: string
  imageUrls: string[]
  description: string
  stockQuantity: number
  categoryId?: string
  category?: {
    name: string
  }
}

interface Seller {
  id: string
  catalogueName: string
  rating?: number
  responseTime?: string
  joinedDate?: string
}

// Helper function to create a slug from product name
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function SellerProductsPage() {
  const params = useParams()
  const sellerId = params.id as string

  const [seller, setSeller] = useState<Seller | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchSellerAndProducts = async () => {
      try {
        setLoading(true)

        // Attempt to fetch all products
        const productsResponse = await fetch("http://localhost:6160/api/v1/products").catch((err) => {
          console.error("Network error fetching products:", err)
          return null
        })

        // If the fetch failed or returned an error status, use fallback data
        if (!productsResponse || !productsResponse.ok) {
          console.warn("Using fallback seller data due to API error")

          // Check if the sellerId matches our fallback seller
          if (sellerId === "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb") {
            const fallbackSeller = {
              id: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
              catalogueName: "Dima Stores",
              rating: 4.8,
              responseTime: "Usually responds within 1 hour",
              joinedDate: "2024-01-15",
            }

            const fallbackProducts = [
              {
                id: "3970c0e2-a929-46f6-9c90-72cd7930c185",
                name: "Anker Soundcore Life Q20",
                description: "Hybrid Active Noise Cancelling over-ear headphones with Hi-Res audio.",
                price: "79.99",
                stockQuantity: 150,
                imageUrls: ["https://res.cloudinary.com/dwl6lr9vq/image/upload/v1741805573/yrc23llqxj1odwvz0r2h.webp"],
                sellerId: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                categoryId: "b38346bd-feca-406e-ac43-8bb107f09031",
                category: {
                  name: "Accessories",
                },
              },
              {
                id: "4970c0e2-a929-46f6-9c90-72cd7930c186",
                name: "Wireless Earbuds",
                description: "Bluetooth 5.0 wireless earbuds with noise cancellation.",
                price: "49.99",
                stockQuantity: 75,
                imageUrls: ["/placeholder.svg?height=400&width=300"],
                sellerId: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                categoryId: "b38346bd-feca-406e-ac43-8bb107f09031",
                category: {
                  name: "Accessories",
                },
              },
              {
                id: "5970c0e2-a929-46f6-9c90-72cd7930c187",
                name: "Smartphone Power Bank",
                description: "20000mAh high capacity power bank with fast charging.",
                price: "39.99",
                stockQuantity: 100,
                imageUrls: ["/placeholder.svg?height=400&width=300"],
                sellerId: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                categoryId: "c38346bd-feca-406e-ac43-8bb107f09032",
                category: {
                  name: "Electronics",
                },
              },
            ]

            setSeller(fallbackSeller)
            setProducts(fallbackProducts)
            setLoading(false)
            return
          } else {
            throw new Error("Seller not found")
          }
        }

        const productsData = await productsResponse.json()
        const allProducts = productsData.data || []

        // Filter products by seller ID
        const sellerProducts = allProducts.filter((product: any) => product.sellerId === sellerId)

        if (sellerProducts.length > 0) {
          // Get seller info from the first product
          const sellerInfo = {
            id: sellerId,
            catalogueName: sellerProducts[0].seller?.catalogueName || "Unknown Seller",
            rating: 4.7,
            responseTime: "Usually responds within 2 hours",
            joinedDate: "2024-01-01",
          }

          setSeller(sellerInfo)
          setProducts(sellerProducts)
        } else {
          throw new Error("No products found for this seller")
        }
      } catch (err) {
        console.error("Error fetching seller and products:", err)
        setError("Failed to load seller and products")
      } finally {
        setLoading(false)
      }
    }

    // Fetch wishlist if user is logged in
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await fetch("http://localhost:6160/api/v1/wishlist")

          if (response.ok) {
            const data = await response.json()
            setWishlist(data.data.map((item: any) => item.productId))
          }
        } catch (err) {
          console.error("Error fetching wishlist:", err)
        }
      }
    }

    fetchSellerAndProducts()
    fetchWishlist()
  }, [sellerId, user])

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

  // Group products by category
  const groupedProducts = products.reduce(
    (acc, product) => {
      const categoryName = product.category?.name || "Uncategorized"
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(product)
      return acc
    },
    {} as Record<string, Product[]>,
  )

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

  if (error || !seller) {
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-500 mb-4">{error || "Seller not found"}</p>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>

        {/* Seller Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-shrink-0 bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
              <Store className="h-8 w-8 text-gray-600" />
            </div>

            <div className="flex-grow">
              <h1 className="text-2xl font-bold mb-1">{seller.catalogueName}</h1>

              <div className="flex items-center gap-1 mb-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(seller.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-1">{seller.rating} rating</span>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  {products.length} products
                </span>
                <span>{seller.responseTime}</span>
              </div>
            </div>

            <div className="md:self-start mt-2 md:mt-0">
              <Button className="bg-black text-white">Contact Seller</Button>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        {Object.keys(groupedProducts).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
              <div key={categoryName}>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-2xl font-bold">{categoryName}</h2>
                  <Badge variant="outline" className="ml-2">
                    {categoryProducts.length} items
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden rounded-lg border hover:shadow-md transition-shadow"
                    >
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
                          {product.stockQuantity <= 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Out of Stock
                            </div>
                          )}
                        </div>
                      </Link>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <Link href={`/product/${createSlug(product.name)}`} className="hover:underline">
                              <h3 className="font-semibold">{product.name}</h3>
                            </Link>
                            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
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
                          <span className="font-bold text-lg">₦{Number.parseFloat(product.price).toFixed(2)}</span>
                          <span className="text-xs text-gray-500">
                            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Link href={`/product/${createSlug(product.name)}`} className="w-full">
                          <Button className="w-full bg-black text-white hover:bg-gray-800" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600 mb-4">No products found from this seller.</p>
            <Link href="/">
              <Button variant="outline">Explore Other Sellers</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

