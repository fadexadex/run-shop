"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Heart, User, Menu, X, MessageSquare, LogOut, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { useAuth } from "@/components/auth/auth-context"
import AuthModal from "@/components/auth/auth-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for search suggestions
const searchSuggestions = [
  { id: 1, name: "T-Shirt", category: "Clothing" },
  { id: 2, name: "Cross Bag", category: "Accessories" },
  { id: 3, name: "Jewellery Set", category: "Accessories" },
  { id: 4, name: "Jollof Rice", category: "Food" },
  { id: 5, name: "Laptop Bag", category: "Accessories" },
  { id: 6, name: "Fried Rice", category: "Food" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()
  const debouncedSearch = useDebounce(searchQuery, 300)
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      // Filter suggestions based on search query
      const filtered = searchSuggestions.filter(
        (item) =>
          item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.category.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [debouncedSearch])

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

  const handleSuggestionClick = (id: number) => {
    router.push(`/product/${id}`)
    setSearchQuery("")
    setShowSuggestions(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
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
            <Link href="/category/accessories" className="font-medium transition-colors hover:text-primary">
              Accessories
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
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-auto">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(item.id)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.category}</div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Desktop Action Icons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/wishlist" className="p-2 rounded-full hover:bg-gray-100">
              <Heart className="h-5 w-5" />
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/messages" className="p-2 rounded-full hover:bg-gray-100">
                  <MessageSquare className="h-5 w-5" />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt={user?.name || ""} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm font-medium">{user?.name}</div>
                    <div className="px-2 pb-1.5 text-xs text-gray-500">{user?.email}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Account</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/messages" className="cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Messages</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="p-2 rounded-full hover:bg-gray-100">
                <User className="h-5 w-5" />
              </button>
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
                <Link href="/category/accessories" className="font-medium py-2 hover:text-primary">
                  Accessories
                </Link>
                <Link href="/category/food" className="font-medium py-2 hover:text-primary">
                  Food
                </Link>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <Link href="/wishlist" className="flex items-center gap-2 py-2 hover:text-primary">
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </Link>

                  {isAuthenticated ? (
                    <>
                      <Link href="/messages" className="flex items-center gap-2 py-2 hover:text-primary">
                        <MessageSquare className="h-5 w-5" />
                        <span>Messages</span>
                      </Link>
                      <Link href="/account" className="flex items-center gap-2 py-2 hover:text-primary">
                        <User className="h-5 w-5" />
                        <span>My Account</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 py-2 text-red-600 w-full text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="flex items-center gap-2 py-2 hover:text-primary w-full text-left"
                    >
                      <User className="h-5 w-5" />
                      <span>Login / Sign Up</span>
                    </button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
    </>
  )
}

