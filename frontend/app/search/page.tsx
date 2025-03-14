"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, Loader2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "@/lib/auth-context"

interface Product {
  id: string
  name: string
  price: string
  description: string
  imageUrls: string[]
  sellerId: string
  categoryId: string
}

// Helper function to create a slug from product name
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 100],
    seller: "all",
  })

  // Hardcoded categories and sellers for performance
  const categories = ["all", "clothing", "electronics", "food", "accessories"]
  const sellers = ["all", "Tech Hub", "Campus Threads", "Campus Eats", "Style Hub"]

  const { user } = useAuth()

  useEffect(() => {
    // Fetch wishlist if user is logged in
    if (user) {
      // In a real app, this would be an API call
      setWishlist(["2", "3"])
    }
  }, [user])

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)
      try {
        // Use the provided search endpoint
        const response = await fetch(`http://localhost:6160/api/v1/products/search?q=${encodeURIComponent(query)}`)

        if (!response.ok) {
          throw new Error("Failed to fetch search results")
        }

        const data = await response.json()

        // Apply filters (in a real app, these would be sent to the API)
        let filteredResults = data.data || []

        if (filters.category !== "all") {
          filteredResults = filteredResults.filter((product: Product) =>
            product.categoryId.toLowerCase().includes(filters.category),
          )
        }

        // Apply price filter (assuming price is a string that can be converted to number)
        filteredResults = filteredResults.filter((product: Product) => {
          const price = Number.parseFloat(product.price)
          return price >= filters.priceRange[0] && price <= filters.priceRange[1]
        })

        if (filters.seller !== "all") {
          filteredResults = filteredResults.filter((product: Product) =>
            product.sellerId.toLowerCase().includes(filters.seller.toLowerCase()),
          )
        }

        setResults(filteredResults)
      } catch (err) {
        console.error("Error fetching search results:", err)
        setError("Error loading search results. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchSearchResults()
    } else {
      setResults([])
      setLoading(false)
    }
  }, [query, filters])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, category: e.target.value })
  }

  const handleSellerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, seller: e.target.value })
  }

  const handlePriceChange = (value: number[]) => {
    setFilters({ ...filters, priceRange: value })
  }

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
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-600 mb-8">
          {query ? `Showing results for "${query}"` : "Enter a search term to find products"}
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className="w-full md:w-1/4">
            <div className="bg-gray-50 p-4 rounded-lg sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={handleCategoryChange}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <Slider
                  defaultValue={[0, 100]}
                  max={100}
                  step={1}
                  value={filters.priceRange}
                  onValueChange={handlePriceChange}
                  className="my-4"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Seller</label>
                <select value={filters.seller} onChange={handleSellerChange} className="w-full p-2 border rounded-md">
                  {sellers.map((seller) => (
                    <option key={seller} value={seller}>
                      {seller === "all" ? "All Sellers" : seller}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() =>
                  setFilters({
                    category: "all",
                    priceRange: [0, 100],
                    seller: "all",
                  })
                }
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 rounded-lg">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
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
                        />
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Link href={`/product/${createSlug(product.name)}`} className="hover:underline">
                            <h3 className="font-semibold">{product.name}</h3>
                          </Link>
                          <p className="text-sm">Category ID: {product.categoryId}</p>
                          <p className="text-xs text-gray-500">Seller ID: {product.sellerId}</p>
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
                        <span className="font-bold">${product.price}</span>
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
            ) : query ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-600 mb-4">No products found matching your criteria.</p>
                <Link href="/products">
                  <Button variant="outline">View All Products</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-600 mb-4">Enter a search term to find products.</p>
                <Link href="/products">
                  <Button variant="outline">Browse All Products</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

