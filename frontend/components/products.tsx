"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart } from "lucide-react"

export default function Products() {
  const [wishlist, setWishlist] = useState<number[]>([])

  const products = [
    {
      id: 1,
      name: "T-Shirt",
      price: 9.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "Clothing",
    },
    {
      id: 2,
      name: "Cross Bag",
      price: 19.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "Accessories",
    },
    {
      id: 3,
      name: "Jewellery Set",
      price: 29.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "Accessories",
    },
    {
      id: 4,
      name: "Jollof Rice",
      price: 5.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "Food",
    },
  ]

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((itemId) => itemId !== id))
    } else {
      setWishlist([...wishlist, id])
    }
  }

  return (
    <section className="w-full py-6 md:py-8 lg:py-16 flex items-center justify-center">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold md:text-4xl">Featured Products</h2>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto mt-4 mb-8">
              Discover our most popular items loved by Redeemer&apos;s University students
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden rounded-lg border">
              <Link href={`/product/${product.id}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover transition-all hover:scale-105 h-48 w-full"
                    width={300}
                    height={400}
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Link href={`/product/${product.id}`} className="hover:underline">
                      <h3 className="font-semibold tracking-tight">{product.name}</h3>
                    </Link>
                    <p className="text-sm">{product.category}</p>
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
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/product/${product.id}`} className="w-full">
                  <Button className="w-full bg-black text-white" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/products">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

