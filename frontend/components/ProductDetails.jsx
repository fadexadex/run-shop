"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "./ui/button"
import { MessageCircle, CreditCard, Truck, Heart } from "lucide-react"

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        const productData = {
          1: {
            id: 1,
            name: "T-Shirt",
            price: 9.99,
            image: "/product-3.jpg?height=400&width=300",
            category: "Clothing",
            description:
              "A comfortable and stylish T-shirt made from premium cotton. Perfect for casual wear and available in multiple colors.",
            features: ["100% Cotton", "Machine washable", "Available in multiple sizes"],
            inStock: true,
            seller: {
              name: "Campus Threads",
              rating: 4.8,
              responseTime: "Usually responds within 1 hour",
            },
          },
          2: {
            id: 2,
            name: "Cross Bag",
            price: 9.99,
            image: "/product-2.jpg?height=400&width=300",
            category: "Accessories",
            description:
              "A versatile cross bag that's perfect for everyday use. Features multiple compartments for organization.",
            features: ["Durable material", "Adjustable strap", "Water resistant"],
            inStock: true,
            seller: {
              name: "Style Hub",
              rating: 4.5,
              responseTime: "Usually responds within 2 hours",
            },
          },
          3: {
            id: 3,
            name: "Jewellerry Set",
            price: 9.99,
            image: "/product-3.jpg?height=400&width=300",
            category: "Electronics",
            description:
              "An elegant jewelry set that includes a necklace and matching earrings. Perfect for special occasions.",
            features: ["High-quality materials", "Elegant design", "Gift box included"],
            inStock: false,
            seller: {
              name: "Glam Accessories",
              rating: 4.7,
              responseTime: "Usually responds within 30 minutes",
            },
          },
          4: {
            id: 4,
            name: "Jollof Rice",
            price: 9.99,
            image: "/product-4.jpg?height=400&width=300",
            category: "Home & Living",
            description: "Authentic Jollof Rice ready to heat and serve. A delicious West African classic dish.",
            features: ["Ready to eat", "Authentic recipe", "Serves 2-3 people"],
            inStock: true,
            seller: {
              name: "Campus Eats",
              rating: 4.9,
              responseTime: "Usually responds within 15 minutes",
            },
          },
        }

        setProduct(productData[id])
      } catch (error) {
        console.error("Error fetching product details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [id])

  const handleQuantityChange = (e) => {
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

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const handlePayOnline = () => {
    alert("Redirecting to payment gateway...")
    // In a real app, this would redirect to a payment gateway
  }

  const handlePayOnDelivery = () => {
    alert("Pay on delivery request sent to seller!")
    // In a real app, this would send a request to the seller
  }

  const handleChatWithSeller = () => {
    alert("Opening chat with seller...")
    // In a real app, this would open a chat interface
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
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
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
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="md:w-1/2">
            <Link to="/products" className="text-sm text-gray-500 hover:underline mb-4 inline-block">
              &larr; Back to Products
            </Link>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-sm text-gray-500 mb-4">{product.category}</p>
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
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">Seller:</h3>
                <span>{product.seller.name}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span>Rating: {product.seller.rating}/5</span>
              </div>
              <p className="text-sm text-gray-600">{product.seller.responseTime}</p>
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc pl-5">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className={`font-semibold ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            {product.inStock && (
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

