"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, ArrowLeft, Loader2, Filter, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"

interface Product {
  id: string
  name: string
  price: string
  imageUrls: string[]
  description: string
  stockQuantity: number
  sellerId?: string
  seller?: {
    catalogueName: string
    id: string
  }
}

interface Category {
  id: string
  name: string
  description: string
}

// Helper function to create a slug from product name
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.categoryId as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const { user } = useAuth()

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedSellers, setSelectedSellers] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("featured")

  useEffect(() => {
    // Replace any fetch or API calls with this pattern:
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Import mock data
        const { categories, products } = await import("@/lib/db")

        // Find the category
        const category = categories.find((c) => c.id === params.categoryId)

        if (!category) {
          setError("Category not found")
          return
        }

        // Filter products by category
        const categoryProducts = products
          .filter((product) => product.category === params.categoryId)
          .map((product) => ({
            id: product.id.toString(),
            name: product.name,
            price: product.price.toString(),
            imageUrls: [product.image],
            description: product.description,
            stockQuantity: Math.floor(Math.random() * 100) + 1,
            sellerId: product.seller.id.toString(),
            seller: {
              id: product.seller.id.toString(),
              catalogueName: product.seller.name,
            },
          }))

        setCategory(category)
        setProducts(categoryProducts)
        setFilteredProducts(categoryProducts)
      } catch (err) {
        console.error("Error fetching category products:", err)
        setError("Failed to load category products")
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

    fetchCategoryProducts()
    fetchWishlist()
  }, [categoryId, user, params.categoryId])

  // Apply filters when they change
  useEffect(() => {
    if (products.length === 0) return

    let result = [...products]

    // Apply price filter
    result = result.filter((product) => {
      const price = Number.parseFloat(product.price)
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Apply seller filter
    if (selectedSellers.length > 0) {
      result = result.filter((product) => selectedSellers.includes(product.sellerId || ""))
    }

    // Apply sorting
    if (sortOption === "price-asc") {
      result.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
    } else if (sortOption === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredProducts(result)
  }, [products, priceRange, selectedSellers, sortOption])

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

  // Get unique sellers for filter
  const uniqueSellers = Array.from(new Set(products.map((p) => p.sellerId))).map((sellerId) => {
    const product = products.find((p) => p.sellerId === sellerId)
    return {
      id: sellerId || "",
      name: product?.seller?.catalogueName || "Unknown Seller",
    }
  })

  // Get price range for filter
  const maxPrice = Math.max(...products.map((p) => Number.parseFloat(p.price)), 100)

  const toggleSellerFilter = (sellerId: string) => {
    if (selectedSellers.includes(sellerId)) {
      setSelectedSellers(selectedSellers.filter((id) => id !== sellerId))
    } else {
      setSelectedSellers([...selectedSellers, sellerId])
    }
  }

  const resetFilters = () => {
    setPriceRange([0, maxPrice])
    setSelectedSellers([])
    setSortOption("featured")
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

  if (error || !category) {
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-500 mb-4">{error || "Category not found"}</p>
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

        {/* Category Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && <p className="text-gray-200 max-w-3xl">{category.description}</p>}
          <Badge variant="outline" className="mt-4 bg-white/10 text-white border-white/20">
            {filteredProducts.length} products
          </Badge>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters & Sort
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className={`w-full md:w-1/4 md:block ${showFilters ? "block" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>

              <Separator className="my-4" />

              <Accordion type="single" collapsible defaultValue="price">
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="px-1">
                      <div className="flex justify-between mb-2 text-sm">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <Slider value={priceRange} min={0} max={maxPrice} step={1} onValueChange={setPriceRange} />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sellers">
                  <AccordionTrigger>Sellers</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {uniqueSellers.map((seller) => (
                        <div key={seller.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`seller-${seller.id}`}
                            checked={selectedSellers.includes(seller.id)}
                            onChange={() => toggleSellerFilter(seller.id)}
                            className="mr-2"
                          />
                          <label htmlFor={`seller-${seller.id}`} className="text-sm">
                            {seller.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator className="my-4" />

              <div>
                <h3 className="font-medium mb-2">Sort By</h3>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="w-full md:w-3/4">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
                          <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                          {product.seller && (
                            <Link
                              href={`/seller/${product.sellerId}`}
                              className="text-xs text-blue-600 hover:underline"
                            >
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
                        <span className="font-bold">₦{Number.parseFloat(product.price).toFixed(2)}</span>
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
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-600 mb-4">No products found matching your criteria.</p>
                <Button onClick={resetFilters} variant="outline">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

