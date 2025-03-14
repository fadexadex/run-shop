"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, CreditCard, Truck, Heart } from "lucide-react"
import { useParams } from "next/navigation"
import { productsApi, ordersApi, wishlistApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

interface Product {
  id: string
  name: string
  description: string
  price: string
  stockQuantity: number
  imageUrls: string[]
  categoryId: string
  sellerId: string
}

export default function ProductDetails() {
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      try {
        const response = await productsApi.getById(id)
        setProduct(response.data)
      } catch (error) {
        setError("Error loading product details. Please try again later.")
        console.error("Error fetching product details:", error)
      } finally {
        setLoading(false)
      }
    }

    const checkWishlist = async () => {
      if (!user) return

      try {
        const response = await wishlistApi.getWishlist()
        if (response && response.data) {
          const isInWishlist = response.data.some((item: any) => item.productId === id)
          setIsWishlisted(isInWishlist)
        }
      } catch (err) {
        console.error("Error checking wishlist:", err)
      }
    }

    if (id) {
      fetchProductDetails()
      checkWishlist()
    }
  }, [id, user])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const toggleWishlist = async () => {
    if (!user) {
      // Redirect to login if not logged in
      window.location.href = "/login"
      return
    }

    try {
      if (isWishlisted) {
        await wishlistApi.removeFromWishlist(id)
        setIsWishlisted(false)
      } else {
        await wishlistApi.addToWishlist(id)
        setIsWishlisted(true)
      }
    } catch (err) {
      console.error("Error updating wishlist:", err)
    }
  }

  const handlePayOnline = async () => {
    if (!user) {
      // Redirect to login if not logged in
      window.location.href = "/login"
      return
    }

    try {
      await ordersApi.createOrder({
        productId: id,
        quantity,
        paymentMethod: "ONLINE",
      })

      alert("Order placed successfully! Redirecting to payment gateway...")
      // In a real app, this would redirect to a payment gateway
    } catch (err: any) {
      console.error("Error placing order:", err)
      alert(err.message || "Failed to place order. Please try again.")
    }
  }

  const handlePayOnDelivery = async () => {
    if (!user) {
      // Redirect to login if not logged in
      window.location.href = "/login"
      return
    }

    try {
      await ordersApi.createOrder({
        productId: id,
        quantity,
        paymentMethod: "DELIVERY",
      })

      alert("Pay on delivery request sent to seller!")
      // In a real app, this would send a request to the seller
    } catch (err: any) {
      console.error("Error placing order:", err)
      alert(err.message || "Failed to place order. Please try again.")
    }
  }

  const handleChatWithSeller = async () => {
    if (!user) {
      // Redirect to login if not logged in
      window.location.href = "/login"
      return
    }

    if (!product) return

    // In a real app, this would open a chat interface with the seller
    alert("Chat functionality would be implemented here")
  }

  if (loading) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{error || "Product Not Found"}</h2>
        <p className="mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="rounded-lg overflow-hidden border">
              <img
                src={
                  product.imageUrls && product.imageUrls.length > 0
                    ? product.imageUrls[0]
                    : "/placeholder.svg?height=400&width=300"
                }
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Additional product images */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.imageUrls.map((imageUrl, index) => (
                  <div key={index} className="border rounded overflow-hidden">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:w-1/2">
            <Link href="/products" className="text-sm text-gray-500 hover:underline mb-4 inline-block">
              &larr; Back to Products
            </Link>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-sm text-gray-500 mb-4">Category: {product.category.name}</p>
              </div>
              <button
                onClick={toggleWishlist}
                className={`p-2 rounded-full ${isWishlisted ? "text-red-500" : "text-gray-400"}`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className="h-6 w-6" fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mb-6">
              <span className="text-2xl font-bold">₦{Number.parseFloat(product.price).toFixed(2)}</span>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">Seller ID:</h3>
                <span>{product.seller.catalogueName}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <p className={`font-semibold ${product.stockQuantity > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : "Out of Stock"}
              </p>
            </div>

            {product.stockQuantity > 0 && (
              <>
                <div className="flex items-center mb-6">
                  <span className="mr-4">Quantity:</span>
                  <div className="flex items-center border rounded">
                    <button onClick={decrementQuantity} className="px-3 py-1 border-r">
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-12 text-center py-1 focus:outline-none"
                    />
                    <button onClick={incrementQuantity} className="px-3 py-1 border-l">
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Button
                    onClick={handlePayOnline}
                    className="bg-black text-white py-3 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pay Online
                  </Button>
                  <Button
                    onClick={handlePayOnDelivery}
                    variant="outline"
                    className="py-3 flex items-center justify-center gap-2"
                  >
                    <Truck className="h-4 w-4" />
                    Pay on Delivery
                  </Button>
                </div>

                <Button
                  onClick={handleChatWithSeller}
                  variant="ghost"
                  className="w-full border border-gray-300 py-3 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with Seller
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

