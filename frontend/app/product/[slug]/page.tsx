"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  MessageCircle,
  CreditCard,
  Truck,
  Heart,
  ArrowLeft,
  Loader2,
  Tag,
  Store,
  Package,
  Star,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockWishlistService, mockOrdersService, createSlug } from "@/lib/mock-service"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function ProductDetails() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const { toast } = useToast()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [orderLoading, setOrderLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1200))

        // Import mock data
        const { products } = await import("@/lib/db")

        // Find the product by slug
        const foundProduct = products.find((p) => createSlug(p.name) === slug)

        if (!foundProduct) {
          setError("Product not found")
          return
        }

        // Format the product data
        const formattedProduct = {
          id: foundProduct.id.toString(),
          name: foundProduct.name,
          price: foundProduct.price.toString(),
          description: foundProduct.description,
          features: foundProduct.features,
          imageUrls: [foundProduct.image],
          category: {
            id: foundProduct.category,
            name: foundProduct.category.charAt(0).toUpperCase() + foundProduct.category.slice(1),
          },
          seller: foundProduct.seller,
          inStock: foundProduct.inStock,
          stockQuantity: foundProduct.stockQuantity || 100,
          sellerId: foundProduct.seller.id.toString(),
        }

        setProduct(formattedProduct)

        // Get related products (same category)
        const related = products
          .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4)
          .map((p) => ({
            id: p.id.toString(),
            name: p.name,
            price: p.price.toString(),
            description: p.description,
            imageUrls: [p.image],
            category: {
              id: p.category,
              name: p.category.charAt(0).toUpperCase() + p.category.slice(1),
            },
          }))

        setRelatedProducts(related)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProductData()
    }
  }, [slug, params.slug])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0 && (!product || value <= product.stockQuantity)) {
      setQuantity(value)
    }
  }

  const incrementQuantity = () => {
    if (!product || quantity < product.stockQuantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  // Update the toggleWishlist function to work with mock data
  const toggleWishlist = async () => {
    if (!user) {
      router.push("/auth/buyer?mode=login")
      return
    }

    if (!product) return

    try {
      if (isWishlisted) {
        await mockWishlistService.removeFromWishlist(user.id, product.id)
        setIsWishlisted(false)
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
          variant: "default",
        })
      } else {
        await mockWishlistService.addToWishlist(user.id, product.id)
        setIsWishlisted(true)
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
          variant: "default",
        })
      }

      // Dispatch event to update wishlist count in navbar
      window.dispatchEvent(new Event("wishlistUpdated"))
    } catch (err) {
      console.error("Error updating wishlist:", err)
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add an effect to check if the product is in the user's wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !product) return

      try {
        const wishlistItems = await mockWishlistService.getUserWishlist(user.id)
        const isInWishlist = wishlistItems.some((item) => item.productId.toString() === product.id)
        setIsWishlisted(isInWishlist)
      } catch (err) {
        console.error("Error checking wishlist status:", err)
      }
    }

    checkWishlistStatus()
  }, [user, product])

  const handlePayOnline = async () => {
    if (!user) {
      router.push("/auth/buyer?mode=login")
      return
    }

    if (!product) return

    try {
      // Show loading state
      setOrderLoading(true)
      setError(null)

      toast({
        title: "Creating your order...",
        description: "Please wait while we process your request.",
      })

      // Prepare order data
      const orderData = {
        userId: user.id,
        sellerId: product.sellerId,
        totalPrice: Number.parseFloat(product.price) * quantity,
        orderStatus: "PENDING",
        paymentMethod: "ONLINE",
        escrowStatus: "HELD",
        items: [
          {
            productId: product.id,
            quantity: quantity,
            price: Number.parseFloat(product.price),
          },
        ],
        hostelName: user.hostelName || "Prophet Moses",
        blockNumber: user.blockNumber || 10,
        roomNo: user.roomNo || 7,
      }

      // Create order
      const orderResponse = await mockOrdersService.createOrder(orderData)

      toast({
        title: "Order created!",
        description: "Redirecting to confirmation page...",
      })

      // Redirect to order confirmation page
      router.push(`/order/${orderResponse.id}/confirm`)
    } catch (err: any) {
      console.error("Error creating order:", err)
      setError(err.message || "Failed to create order. Please try again.")
      toast({
        title: "Error",
        description: err.message || "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setOrderLoading(false)
    }
  }

  const handlePayOnDelivery = async () => {
    if (!user) {
      router.push("/auth/buyer?mode=login")
      return
    }

    if (!product) return

    try {
      setOrderLoading(true)
      setError(null)

      toast({
        title: "Creating your order...",
        description: "Please wait while we process your request.",
      })

      // Prepare order data
      const orderData = {
        userId: user.id,
        sellerId: product.sellerId,
        totalPrice: Number.parseFloat(product.price) * quantity,
        orderStatus: "PENDING",
        paymentMethod: "DELIVERY",
        escrowStatus: "HELD",
        items: [
          {
            productId: product.id,
            quantity: quantity,
            price: Number.parseFloat(product.price),
          },
        ],
        hostelName: user.hostelName || "Prophet Moses",
        blockNumber: user.blockNumber || 10,
        roomNo: user.roomNo || 7,
      }

      // Create order
      const orderResponse = await mockOrdersService.createOrder(orderData)

      toast({
        title: "Order created!",
        description: "Redirecting to chat with seller...",
      })

      // Redirect to chat page for Pay on Delivery
      router.push(`/chat/${orderResponse.id}`)
    } catch (err: any) {
      console.error("Error creating order:", err)
      setError(err.message || "Failed to create order. Please try again.")
      toast({
        title: "Error",
        description: err.message || "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setOrderLoading(false)
    }
  }

  const handleChatWithSeller = async () => {
    if (!user) {
      router.push("/auth/buyer?mode=login")
      return
    }

    if (!product) return

    toast({
      title: "Chat initiated",
      description: `Chat with ${product.seller.catalogueName} would open here.`,
    })
  }

  const handleAddToCart = () => {
    if (!user) {
      router.push("/auth/buyer?mode=login")
      return
    }

    if (!product) return

    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart!`,
    })
  }

  if (loading) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{error || "Product Not Found"}</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-black">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Images */}
          <div>
            <div className="rounded-lg overflow-hidden border bg-white shadow-md flex items-center justify-center p-4">
              <img
                src={product.imageUrls[activeImage] || "/placeholder.svg?height=250&width=250"}
                alt={product.name}
                className="object-contain max-h-[300px] max-w-full"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.imageUrls.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {product.imageUrls.map((imageUrl: string, index: number) => (
                  <div
                    key={index}
                    className={`border rounded-md overflow-hidden cursor-pointer transition-all flex-shrink-0 ${
                      activeImage === index ? "ring-2 ring-black" : "hover:opacity-80"
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={imageUrl || "/placeholder.svg?height=60&width=60"}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-14 h-14 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="flex flex-col h-full">
              <div className="mb-2">
                <Link href={`/category/${product.categoryId}`}>
                  <Badge variant="outline" className="mb-2">
                    <Tag className="h-3 w-3 mr-1" />
                    {product.category.name}
                  </Badge>
                </Link>
              </div>

              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-sm text-gray-500 ml-2">(24 reviews)</span>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold">₦{Number.parseFloat(product.price).toFixed(2)}</span>
                {product.stockQuantity > 0 && <span className="ml-2 text-sm text-green-600">In Stock</span>}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold">Seller:</h3>
                  <Link href={`/seller/${product.seller.id}`} className="text-blue-600 hover:underline font-medium">
                    {product.seller.catalogueName}
                  </Link>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className={`font-medium ${product.stockQuantity > 0 ? "text-green-600" : "text-red-600"}`}>
                    {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : "Out of Stock"}
                  </span>
                </div>
                <Link href={`/seller/${product.seller.id}`} className="mt-2 inline-block">
                  <Button variant="outline" size="sm" className="text-sm">
                    View All Products from this Seller
                  </Button>
                </Link>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Separator className="my-4" />

              {product.stockQuantity > 0 && (
                <>
                  <div className="flex items-center mb-6">
                    <span className="mr-4">Quantity:</span>
                    <div className="flex items-center border rounded shadow-sm">
                      <button
                        onClick={decrementQuantity}
                        className="px-3 py-1 border-r hover:bg-gray-100"
                        disabled={quantity <= 1}
                      >
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
                        className="px-3 py-1 border-l hover:bg-gray-100"
                        disabled={quantity >= product.stockQuantity}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Button
                      onClick={handlePayOnline}
                      className="bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-gray-800"
                      disabled={orderLoading}
                    >
                      {orderLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      {orderLoading ? "Processing..." : "Pay Online"}
                    </Button>
                    <Button
                      onClick={handlePayOnDelivery}
                      variant="outline"
                      className="py-3 flex items-center justify-center gap-2 hover:bg-gray-100"
                      disabled={orderLoading}
                    >
                      {orderLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Truck className="h-4 w-4" />}
                      {orderLoading ? "Processing..." : "Pay on Delivery"}
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={toggleWishlist}
                      className={`flex-1 ${isWishlisted ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-gray-800"} text-white py-3 flex items-center justify-center gap-2`}
                      disabled={orderLoading}
                    >
                      <Heart className="h-4 w-4" fill={isWishlisted ? "white" : "none"} />
                      {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    </Button>
                    <Button
                      onClick={handleChatWithSeller}
                      variant="ghost"
                      className="flex-1 border border-gray-300 py-3 flex items-center justify-center gap-2 hover:bg-gray-100"
                      disabled={orderLoading}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat with Seller
                    </Button>
                  </div>
                </>
              )}

              {product.stockQuantity <= 0 && (
                <div className="text-center py-4 bg-red-50 rounded-lg">
                  <p className="text-red-600 font-medium">This product is currently out of stock.</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Please check back later or contact the seller for more information.
                  </p>
                  <div className="mt-4 flex gap-4">
                    <Button
                      onClick={toggleWishlist}
                      className={`flex-1 ${isWishlisted ? "bg-red-100 text-red-600 border-red-300" : "bg-gray-100"}`}
                    >
                      <Heart className="h-4 w-4 mr-2" fill={isWishlisted ? "currentColor" : "none"} />
                      {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                    </Button>
                    <Button onClick={handleChatWithSeller} variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4 bg-white rounded-md shadow-sm mt-2">
              <h3 className="text-lg font-semibold mb-2">Product Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="p-4 bg-white rounded-md shadow-sm mt-2">
              <h3 className="text-lg font-semibold mb-2">Product Specifications</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Brand: Anker</li>
                <li>Model: Soundcore Life Q20</li>
                <li>Battery Life: Up to 40 hours</li>
                <li>Connectivity: Bluetooth 5.0</li>
                <li>Noise Cancellation: Hybrid Active Noise Cancelling</li>
                <li>Weight: 9.3 oz (263g)</li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="p-4 bg-white rounded-md shadow-sm mt-2">
              <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
              <div className="space-y-4">
                <div className="p-3 border rounded-md">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <span className="ml-2 text-sm font-medium">Great product!</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    These headphones are amazing! The noise cancellation works really well and the battery life is
                    impressive.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">John D. - March 10, 2025</p>
                </div>
                <div className="p-3 border rounded-md">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                    <span className="ml-2 text-sm font-medium">Good value</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    For the price, these are excellent headphones. Comfortable to wear for long periods.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Sarah M. - February 28, 2025</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden rounded-lg border hover:shadow-md transition-shadow"
                >
                  <Link href={`/product/${createSlug(relatedProduct.name)}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          relatedProduct.imageUrls && relatedProduct.imageUrls.length > 0
                            ? relatedProduct.imageUrls[0]
                            : "/placeholder.svg?height=150&width=150"
                        }
                        alt={relatedProduct.name}
                        className="object-cover transition-all hover:scale-105 h-36 w-full"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <div className="space-y-1">
                      <Link href={`/product/${createSlug(relatedProduct.name)}`} className="hover:underline">
                        <h3 className="font-semibold">{relatedProduct.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-500 line-clamp-2">{relatedProduct.description}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold">₦{Number.parseFloat(relatedProduct.price).toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/product/${createSlug(relatedProduct.name)}`} className="w-full">
                      <Button className="w-full bg-black text-white" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

