"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Heart, User, Menu, X, ShoppingBag } from "lucide-react"
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

  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      fetchSearchSuggestions(debouncedSearch)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
  }, [debouncedSearch])

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <ShoppingBag className="h-6 w-6" />
          <span>RUNShop</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/products" className="font-medium transition-colors hover:text-primary">
            All Products
          </Link>
          <Link href="/category/clothing" className="font-medium transition-colors hover:text-primary">
            Clothing
          </Link>
          <Link href="/category/electronics" className="font-medium transition-colors hover:text-primary">
            Electronics
          </Link>
          <Link href="/category/food" className="font-medium transition-colors hover:text-primary">
            Food
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative flex-1 max-w-sm mx-4">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search products..."
            className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

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
        </form>

        {/* Desktop Action Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/wishlist" className="p-2 rounded-full hover:bg-gray-100">
            <Heart className="h-5 w-5" />
          </Link>
          {user ? (
            <Link href="/account" className="p-2 rounded-full hover:bg-gray-100">
              <User className="h-5 w-5" />
            </Link>
          ) : (
            <Link href="/auth?mode=login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
          )}
          {user?.role === "SELLER" && (
            <Link href="/seller/dashboard">
              <Button size="sm" className="bg-black text-white">
                Seller Dashboard
              </Button>
            </Link>
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
                  className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <nav className="flex flex-col gap-4">
              <Link href="/products" className="font-medium py-2 hover:text-primary">
                All Products
              </Link>
              <Link href="/category/clothing" className="font-medium py-2 hover:text-primary">
                Clothing
              </Link>
              <Link href="/category/electronics" className="font-medium py-2 hover:text-primary">
                Electronics
              </Link>
              <Link href="/category/food" className="font-medium py-2 hover:text-primary">
                Food
              </Link>
              <div className="border-t border-gray-200 my-2 pt-2">
                <Link href="/wishlist" className="flex items-center gap-2 py-2 hover:text-primary">
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Link>
                {user ? (
                  <>
                    <Link href="/account" className="flex items-center gap-2 py-2 hover:text-primary">
                      <User className="h-5 w-5" />
                      <span>My Account</span>
                    </Link>
                    {user.role === "SELLER" && (
                      <Link href="/seller/dashboard" className="flex items-center gap-2 py-2 hover:text-primary">
                        <ShoppingBag className="h-5 w-5" />
                        <span>Seller Dashboard</span>
                      </Link>
                    )}
                  </>
                ) : (
                  <Link href="/auth?mode=login" className="flex items-center gap-2 py-2 hover:text-primary">
                    <User className="h-5 w-5" />
                    <span>Log In</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

