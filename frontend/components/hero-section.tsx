"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
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

  return (
    <section className={`w-full py-16 md:py-24 lg:py-32 ${backgrounds[currentBg]} transition-colors duration-1000`}>
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col space-y-4 text-white">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Campus Shopping <span className="text-yellow-300">Made Easy</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
                Connect directly with trusted student sellers at Redeemer's University. From essentials to unique finds,
                everything you need is just a click away.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/products">
                <Button className="bg-white text-black hover:bg-gray-100 px-8 font-medium">Explore Products</Button>
              </Link>
              <Link href="/auth?mode=register&type=seller">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                  Become a Seller
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg text-center">
                <p className="text-2xl font-bold">100+</p>
                <p className="text-sm">Campus Sellers</p>
              </div>
              <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg text-center">
                <p className="text-2xl font-bold">1000+</p>
                <p className="text-sm">Products</p>
              </div>
              <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg text-center">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm">Support</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative">
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Campus fashion"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Tech gadgets"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Food delivery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Study materials"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 bg-white/20 p-3 rounded-lg">
                <p className="text-sm font-medium text-center">Everything you need, from students like you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

