"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Heart, User, Menu, X, ShoppingBag, Store } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const debouncedSearch = useDebounce(searchQuery, 300)
  const { user } = useAuth()
  const searchRef = useRef<HTMLDivElement>(null)

  // Add wishlist count functionality
  // First, add a state for wishlist count
  const [wishlistCount, setWishlistCount] = useState(0)

  // Add an effect to update the wishlist count
  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!user) return

      try {
        // In a real app, this would be an API call
        // For demo, we'll use a mock count
        const { wishlistItems } = await import("@/lib/db")
        const userWishlist = wishlistItems.filter((item) => item.userId === user.id)
        setWishlistCount(userWishlist.length)
      } catch (err) {
        console.error("Error fetching wishlist count:", err)
      }
    }

    fetchWishlistCount()

    // Set up an event listener for wishlist updates
    const handleWishlistUpdate = () => fetchWishlistCount()
    window.addEventListener("wishlistUpdated", handleWishlistUpdate)

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate)
    }
  }, [user])

  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      fetchSearchSuggestions(debouncedSearch)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
  }, [debouncedSearch])

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const fetchSearchSuggestions = async (query: string) => {
    if (query.length < 2) return

    setIsSearching(true)
    try {
      // Use the search API endpoint
      const response = await fetch(`http://localhost:6160/api/v1/products/search?q=${encodeURIComponent(query)}`)

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.data || [])
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Error fetching search suggestions:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (id: string) => {
    router.push(`/product/${id}`)
    setSearchQuery("")
    setShowSuggestions(false)
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/category/${categoryId}`)
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#008ECC]">
          <ShoppingBag className="h-6 w-6" />
          <span>RUNShop</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/products" className="font-medium transition-colors hover:text-[#008ECC]">
            All Products
          </Link>
          <Link href="/category/clothing" className="font-medium transition-colors hover:text-[#008ECC]">
            Clothing
          </Link>
          <Link href="/category/electronics" className="font-medium transition-colors hover:text-[#008ECC]">
            Electronics
          </Link>
          <Link href="/category/food" className="font-medium transition-colors hover:text-[#008ECC]">
            Food
          </Link>
        </nav>

        {/* Search Bar */}
        <div ref={searchRef} className="hidden md:flex items-center relative flex-1 max-w-sm mx-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search for products, sellers..."
                className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-[#008ECC]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
              />
            </div>
          </form>

          {/* Search Suggestions */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-auto">
              {isSearching ? (
                <div className="px-4 py-2 text-center text-sm text-gray-500">Searching...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(item.id)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">${item.price}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-center text-sm text-gray-500">No products found</div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Action Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/wishlist" className="p-2 rounded-full hover:bg-gray-100 relative">
            <Heart className="h-5 w-5" />
            {user && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#008ECC] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {user ? (
            user.role === "SELLER" ? (
              <div className="flex items-center gap-2">
                <Link href="/account" className="p-2 rounded-full hover:bg-gray-100">
                  <User className="h-5 w-5" />
                </Link>
                <Link href="/seller/dashboard">
                  <Button size="sm" className="bg-[#008ECC] text-white hover:bg-[#007bb3]">
                    <Store className="h-4 w-4 mr-2" />
                    Seller Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/account" className="p-2 rounded-full hover:bg-gray-100">
                <User className="h-5 w-5" />
              </Link>
            )
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/buyer?mode=login">
                <Button variant="outline" size="sm" className="border-[#008ECC] text-[#008ECC] hover:bg-[#008ECC]/10">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/buyer?mode=register">
                <Button size="sm" className="bg-[#008ECC] text-white hover:bg-[#007bb3]">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 md:hidden">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-[#008ECC]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <nav className="flex flex-col gap-4">
              <Link href="/products" className="font-medium py-2 hover:text-[#008ECC]">
                All Products
              </Link>
              <button
                onClick={() => handleCategoryClick("clothing")}
                className="text-left font-medium py-2 hover:text-[#008ECC]"
              >
                Clothing
              </button>
              <button
                onClick={() => handleCategoryClick("electronics")}
                className="text-left font-medium py-2 hover:text-[#008ECC]"
              >
                Electronics
              </button>
              <button
                onClick={() => handleCategoryClick("food")}
                className="text-left font-medium py-2 hover:text-[#008ECC]"
              >
                Food
              </button>
              <div className="border-t border-gray-200 my-2 pt-2">
                <Link href="/wishlist" className="flex items-center gap-2 py-2 hover:text-[#008ECC]">
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Link>
                {user ? (
                  <>
                    <Link href="/account" className="flex items-center gap-2 py-2 hover:text-[#008ECC]">
                      <User className="h-5 w-5" />
                      <span>My Account</span>
                    </Link>
                    {user.role === "SELLER" && (
                      <Link href="/seller/dashboard" className="flex items-center gap-2 py-2 hover:text-[#008ECC]">
                        <Store className="h-5 w-5" />
                        <span>Seller Dashboard</span>
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link href="/auth/buyer?mode=login" className="flex items-center gap-2 py-2 hover:text-[#008ECC]">
                      <User className="h-5 w-5" />
                      <span>Log In</span>
                    </Link>
                    <Link href="/auth/seller?mode=login" className="flex items-center gap-2 py-2 hover:text-[#008ECC]">
                      <Store className="h-5 w-5" />
                      <span>Seller Login</span>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

