"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, CreditCard, Truck, Heart } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import AuthModal from "@/components/auth/auth-modal"
import { productAPI, userAPI } from "@/lib/api"

export default function ProductDetails() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { isAuthenticated, user } = useAuth()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authAction, setAuthAction] = useState<"chat" | "payment" | "wishlist" | null>(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      try {
        const productData = await productAPI.getProductById(id)
        setProduct(productData)

        // Check if product is in user's wishlist
        if (isAuthenticated) {
          try {
            const wishlist = await userAPI.getWishlist()
            const isInWishlist = wishlist.items.some((item: any) => item.productId === id)
            setIsWishlisted(isInWishlist)
          } catch (error) {
            console.error("Error checking wishlist:", error)
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProductDetails()
    }
  }, [id, isAuthenticated])

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
    if (!isAuthenticated) {
      setAuthAction("wishlist")
      setShowAuthModal(true)
      return
    }

    try {
      if (isWishlisted) {
        await userAPI.removeFromWishlist(id)
      } else {
        await userAPI.addToWishlist(id)
      }
      setIsWishlisted(!isWishlisted)
    } catch (error) {
      console.error("Error updating wishlist:", error)
    }
  }

  const handlePayOnline = () => {
    if (!isAuthenticated) {
      setAuthAction("payment")
      setShowAuthModal(true)
      return
    }

    // In a real app, this would redirect to a payment gateway
    alert("Redirecting to payment gateway...")
  }

  const handlePayOnDelivery = () => {
    if (!isAuthenticated) {
      setAuthAction("payment")
      setShowAuthModal(true)
      return
    }

    // In a real app, this would send a request to the seller
    alert("Pay on delivery request sent to seller!")
  }

  const handleChatWithSeller = () => {
    if (!isAuthenticated) {
      setAuthAction("chat")
      setShowAuthModal(true)
      return
    }

    // Navigate to chat with this seller
    router.push(`/chat/${product.seller.id}?productId=${product.id}`)
  }

  const handleAuthSuccess = () => {
    // After successful authentication, perform the intended action
    if (authAction === "chat") {
      router.push(`/chat/${product.seller.id}?productId=${product.id}`)
    } else if (authAction === "payment") {
      alert("You can now proceed with payment!")
    } else if (authAction === "wishlist") {
      toggleWishlist()
    }

    setAuthAction(null)
  }

  if (loading) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden border">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img
                    src={product.imageUrls[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <img
                    src="/placeholder.svg?height=400&width=300"
                    alt={product.name}
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>

              {/* Additional product images */}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {product.imageUrls.slice(0, 4).map((imageUrl: string, index: number) => (
                    <div key={index} className="rounded-md overflow-hidden border">
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
                  <p className="text-sm text-gray-500 mb-4">{product.category?.name}</p>
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
                <span className="text-2xl font-bold">${Number.parseFloat(product.price).toFixed(2)}</span>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">Seller:</h3>
                  <span>{product.seller?.catalogueName || "Unknown Seller"}</span>
                </div>
                {product.seller?.ratings && (
                  <div className="flex items-center gap-2 mb-2">
                    <span>Rating: {product.seller.ratings}/5</span>
                  </div>
                )}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="mb-6">
                <p className={`font-semibold ${product.stockQuantity > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                  {product.stockQuantity > 0 && ` (${product.stockQuantity} available)`}
                </p>
              </div>

              {product.stockQuantity > 0 && (
                <>
                  <div className="flex items-center mb-6">
                    <span className="mr-4">Quantity:</span>
                    <div className="flex items-center border rounded">
                      <button onClick={decrementQuantity} className="px-3 py-1 border-r" disabled={quantity <= 1}>
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
                      <button
                        onClick={incrementQuantity}
                        className="px-3 py-1 border-l"
                        disabled={quantity >= product.stockQuantity}
                      >
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

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          message={
            authAction === "chat"
              ? "Please login or create an account to chat with the seller."
              : authAction === "payment"
                ? "Please login or create an account to make a purchase."
                : "Please login or create an account to add items to your wishlist."
          }
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  )
}

