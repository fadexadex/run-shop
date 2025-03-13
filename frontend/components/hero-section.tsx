"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const [currentBg, setCurrentBg] = useState(0)

  const backgrounds = [
    "bg-gradient-to-r from-purple-700 to-indigo-900",
    "bg-gradient-to-r from-blue-700 to-teal-500",
    "bg-gradient-to-r from-orange-500 to-pink-500",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section className={`w-full py-12 md:py-24 lg:py-32 ${backgrounds[currentBg]} transition-colors duration-1000`}>
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center text-white">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              The Ultimate Shop for Redeemer&apos;s University Students
            </h1>
            <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
              Find everything you need from food to clothing, all in one place. Connect with trusted campus sellers.
            </p>
          </div>

          <form onSubmit={handleSearch} className="w-full max-w-md flex items-center relative mt-6">
            <input
              type="search"
              placeholder="What are you looking for?"
              className="w-full py-3 pl-4 pr-12 text-black bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-1 p-2 bg-black text-white rounded-full hover:bg-gray-800"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/products">
              <Button className="bg-white text-black hover:bg-gray-100 px-8">Browse Products</Button>
            </Link>
            <Link href="/auth?mode=register&type=seller">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

