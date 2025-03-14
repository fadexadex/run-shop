"use client"

import { CardFooter } from "@/components/ui/card"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

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
  ShoppingCart,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Product {
  id: string
  name: string
  description: string
  price: string
  stockQuantity: number
  imageUrls: string[]
  categoryId: string
  sellerId: string
  category: {
    name: string
  }
  seller: {
    id: string
    catalogueName: string
  }
}

// Helper function to create a slug from product name
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function ProductDetails() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const { user } = useAuth()

  const fetchProductDetails = async () => {
    setLoading(true)
    try {
      // First, try to fetch all products to find the one with matching slug
      const productsResponse = await fetch("http://localhost:6160/api/v1/products").catch((err) => {
        console.error("Network error fetching products:", err)
        return null
      })

      // If the fetch failed or returned an error status, use fallback data
      if (!productsResponse || !productsResponse.ok) {
        console.warn("Using fallback product data due to API error")

        // Check if the slug matches our fallback product
        if (slug === "anker-soundcore-life-q20") {
          const fallbackProduct = {
            id: "3970c0e2-a929-46f6-9c90-72cd7930c185",
            name: "Anker Soundcore Life Q20",
            description:
              "Hybrid Active Noise Cancelling over-ear headphones with Hi-Res audio, deep bass, and up to 40 hours of playtime. Features memory foam ear cups and Bluetooth 5.0 for seamless connectivity.",
            price: "79.99",
            stockQuantity: 150,
            categoryId: "b38346bd-feca-406e-ac43-8bb107f09031",
            imageUrls: ["https://res.cloudinary.com/dwl6lr9vq/image/upload/v1741805573/yrc23llqxj1odwvz0r2h.webp"],
            sellerId: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
            category: {
              name: "Accessories",
            },
            seller: {
              id: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
              catalogueName: "Dima Stores",
            },
          }

          // Related products
          const fallbackRelated = [
            {
              id: "4970c0e2-a929-46f6-9c90-72cd7930c186",
              name: "Wireless Earbuds",
              description: "Bluetooth 5.0 wireless earbuds with noise cancellation.",
              price: "49.99",
              stockQuantity: 75,
              imageUrls: ["/placeholder.svg?height=400&width=300"],
              sellerId: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
              categoryId: "b38346bd-feca-406e-ac43-8bb107f09031",
              category: {
                name: "Accessories",
              },
              seller: {
                id: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                catalogueName: "Dima Stores",
              },
            },
            {
              id: "5970c0e2-a929-46f6-9c90-72cd7930c187",
              name: "Smartphone Power Bank",
              description: "20000mAh high capacity power bank with fast charging.",
              price: "39.99",
              stockQuantity: 100,
              imageUrls: ["/placeholder.svg?height=400&width=300"],
              sellerId: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
              categoryId: "c38346bd-feca-406e-ac43-8bb107f09032",
              category: {
                name: "Electronics",
              },
              seller: {
                id: "c8d1f69f-201e-4cb4-935b-4b5d3da97aeb",
                catalogueName: "Dima Stores",
              },
            },
          ]

          setProduct(fallbackProduct)
          setRelatedProducts(fallbackRelated)
          setLoading(false)
          return
        } else {
          throw new Error("Product not found")
        }
      }

      const productsData = await productsResponse.json()
      const products = productsData.data || []

      // Find the product with a matching slug
      const matchedProduct = products.find((p: any) => createSlug(p.name) === slug)

      if (!matchedProduct) {
        throw new Error("Product not found")
      }

      // Fetch detailed product information
      const response = await fetch(`http://localhost:6160/api/v1/products/${matchedProduct.id}`).catch((err) => {
        console.error("Network error fetching product details:", err)
        return null
      })

      if (!response || !response.ok) {
        throw new Error("Failed to fetch product details")
      }

      const data = await response.json()
      setProduct(data.data)

      // Find related products (same category or same seller)
      const related = products
        .filter(
          (p: any) =>
            p.id !== matchedProduct.id &&
            (p.categoryId === matchedProduct.categoryId || p.sellerId === matchedProduct.sellerId),
        )
        .slice(0, 4)

      setRelatedProducts(related)
    } catch (error) {
      console.error("Error fetching product details:", error)
      setError("Error loading product details. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return

      try {
        const response = await fetch("http://localhost:6160/api/v1/wishlist")
        if (response.ok) {
          const data = await response.json()
          if (data.data) {
            const productInWishlist = data.data.some((item: any) => {
              // Find the product with matching slug
              const itemProduct = item.product || {}
              return createSlug(itemProduct.name) === slug
            })
            setIsWishlisted(productInWishlist)
          }
        }
      } catch (err) {
        console.error("Error checking wishlist:", err)
      }
    }

    if (slug) {
      fetchProductDetails()
      checkWishlist()
    }
  }, [slug, user])

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

  const toggleWishlist = async () => {
    if (!user) {
      router.push("/auth?mode=login")
      return
    }

    if (!product) return

    try {
      if (isWishlisted) {
        // Find wishlist item ID first
        const wishlistResponse = await fetch("http://localhost:6160/api/v1/wishlist")
        if (wishlistResponse.ok) {
          const wishlistData = await wishlistResponse.json()
          const wishlistItem = wishlistData.data.find((item: any) => item.product && item.product.id === product.id)

          if (wishlistItem) {
            await fetch(`http://localhost:6160/api/v1/wishlist/${wishlistItem.id}`, {
              method: "DELETE",
            })
            setIsWishlisted(false)
          }
        }
      } else {
        await fetch("http://localhost:6160/api/v1/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: product.id }),
        })
        setIsWishlisted(true)
      }
    } catch (err) {
      console.error("Error updating wishlist:", err)
    }
  }

  const handlePayOnline = async () => {
    if (!user) {
      router.push("/auth?mode=login")
      return
    }

    if (!product) return

    try {
      // Show loading state
      setError(null)
      const loadingToast = alert("Creating your order...")

      // Get delivery information from user profile
      const hostelName = user.hostelName || "Prophet Moses"
      const blockNumber = user.blockNumber || 10
      const roomNo = user.roomNo || 7

      // Prepare order data
      const orderData = {
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
        hostelName,
        blockNumber,
        roomNo,
      }

      // Get token
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Create order
      const response = await fetch("http://localhost:6160/api/v1/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to create order")
      }

      // Get order details
      const orderResponse = await response.json()

      // Redirect to order confirmation page
      router.push(`/order/${orderResponse.id}/confirm`)
    } catch (err: any) {
      console.error("Error creating order:", err)
      setError(err.message || "Failed to create order. Please try again.")
    }
  }

  const handlePayOnDelivery = async () => {
    if (!user) {
      router.push("/auth?mode=login")
      return
    }

    if (!product) return

    try {
      await fetch("http://localhost:6160/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          paymentMethod: "DELIVERY",
        }),
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
      router.push("/auth?mode=login")
      return
    }

    if (!product) return

    // In a real app, this would open a chat interface with the seller
    alert(`Chat with ${product.seller.catalogueName} would open here`)
  }

  const handleAddToCart = () => {
    if (!user) {
      router.push("/auth?mode=login")
      return
    }

    if (!product) return

    alert(`Added ${quantity} ${product.name} to your cart!`)
    // In a real app, this would add the product to the cart
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
                {product.imageUrls.map((imageUrl, index) => (
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
                <span className="text-2xl font-bold">${Number.parseFloat(product.price).toFixed(2)}</span>
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
                    >
                      <CreditCard className="h-4 w-4" />
                      Pay Online
                    </Button>
                    <Button
                      onClick={handlePayOnDelivery}
                      variant="outline"
                      className="py-3 flex items-center justify-center gap-2 hover:bg-gray-100"
                    >
                      <Truck className="h-4 w-4" />
                      Pay on Delivery
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={handleChatWithSeller}
                      variant="ghost"
                      className="flex-1 border border-gray-300 py-3 flex items-center justify-center gap-2 hover:bg-gray-100"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat with Seller
                    </Button>
                    <Button
                      onClick={toggleWishlist}
                      variant="ghost"
                      className={`border py-3 ${
                        isWishlisted ? "border-red-300 text-red-500" : "border-gray-300 text-gray-700"
                      }`}
                    >
                      <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
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
                      <span className="font-bold">${Number.parseFloat(relatedProduct.price).toFixed(2)}</span>
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

