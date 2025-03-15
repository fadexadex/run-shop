"use client"

import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Slider } from "./ui/slider"

// Helper function to create a slug from product name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function SearchResults() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const query = searchParams.get("q") || ""

  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 100],
    seller: "all",
  })

  // Mock data for demonstration
  const allProducts = [
    {
      id: 1,
      name: "T-Shirt",
      price: 9.99,
      image: "/product-3.jpg?height=400&width=300",
      category: "Clothing",
      seller: "Campus Threads",
    },
    {
      id: 2,
      name: "Cross Bag",
      price: 19.99,
      image: "/product-2.jpg?height=400&width=300",
      category: "Accessories",
      seller: "Style Hub",
    },
    {
      id: 3,
      name: "Jewellery Set",
      price: 29.99,
      image: "/product-3.jpg?height=400&width=300",
      category: "Accessories",
      seller: "Glam Accessories",
    },
    {
      id: 4,
      name: "Jollof Rice",
      price: 5.99,
      image: "/product-4.jpg?height=400&width=300",
      category: "Food",
      seller: "Campus Eats",
    },
    {
      id: 5,
      name: "Laptop Bag",
      price: 24.99,
      image: "/product-2.jpg?height=400&width=300",
      category: "Accessories",
      seller: "Tech Gear",
    },
    {
      id: 6,
      name: "Fried Rice",
      price: 6.99,
      image: "/product-4.jpg?height=400&width=300",
      category: "Food",
      seller: "Campus Eats",
    },
  ]

  // Get unique categories and sellers for filters
  const categories = ["all", ...new Set(allProducts.map((p) => p.category))]
  const sellers = ["all", ...new Set(allProducts.map((p) => p.seller))]

  useEffect(() => {
    setLoading(true)

    // Simulate API call with filtering
    setTimeout(() => {
      let filtered = [...allProducts]

      // Filter by search query
      if (query) {
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()),
        )
      }

      // Apply category filter
      if (filters.category !== "all") {
        filtered = filtered.filter((p) => p.category === filters.category)
      }

      // Apply price range filter
      filtered = filtered.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])

      // Apply seller filter
      if (filters.seller !== "all") {
        filtered = filtered.filter((p) => p.seller === filters.seller)
      }

      setResults(filtered)
      setLoading(false)
    }, 500)
  }, [query, filters])

  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value })
  }

  const handleSellerChange = (e) => {
    setFilters({ ...filters, seller: e.target.value })
  }

  const handlePriceChange = (value) => {
    setFilters({ ...filters, priceRange: value })
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-600 mb-8">{query ? `Showing results for "${query}"` : "Showing all products"}</p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className="w-full md:w-1/4">
            <div className="bg-gray-50 p-4 rounded-lg">
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
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Price Range: ₦{filters.priceRange[0]} - ₦{filters.priceRange[1]}
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <Card key={product.id} className="overflow-hidden rounded-lg border">
                    <Link to={`/product/${createSlug(product.name)}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="object-cover transition-all hover:scale-105 h-48 w-full"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <div className="space-y-1">
                        <Link to={`/product/${createSlug(product.name)}`} className="hover:underline">
                          <h3 className="font-semibold">{product.name}</h3>
                        </Link>
                        <p className="text-sm">{product.category}</p>
                        <p className="text-xs text-gray-500">{product.seller}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-bold">₦{product.price.toFixed(2)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full bg-black text-white" size="sm">
                        Add to Wishlist
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">No products found matching your criteria.</p>
                <Link to="/products">
                  <Button variant="outline">View All Products</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

