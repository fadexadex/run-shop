"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, AlertCircle, ShoppingBag, MapPin, MessageCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Separator } from "@/components/ui/separator"
import { mockOrdersService } from "@/lib/mock-service"

export default function OrderDetailsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect if user is not logged in
    if (!user && !localStorage.getItem("token")) {
      router.push("/auth/buyer?mode=login")
      return
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true)

        // Fetch order details using mock service
        const orderData = await mockOrdersService.getOrderById(orderId)

        if (!orderData) {
          throw new Error("Order not found")
        }

        setOrder(orderData)
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError(error instanceof Error ? error.message : "Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, router, user])

  if (loading) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#008ECC]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-500 mb-6">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="mb-6">We couldn't find the order you're looking for.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm text-gray-600 hover:text-[#008ECC] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
        </Link>

        <h1 className="text-3xl font-bold mb-6">Order Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" /> Order Summary
                </CardTitle>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.productId} className="flex items-start border-b pb-4">
                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
                      <img
                        src={order.product?.imageUrls?.[0] || "/placeholder.svg?height=64&width=64"}
                        alt={order.product?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{order.product?.name || `Product #${item.productId.slice(0, 8)}`}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x ₦{item.price.toFixed(2)}
                      </p>
                      {order.product?.seller && (
                        <p className="text-xs text-gray-500 mt-1">Sold by: {order.product.seller.catalogueName}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₦{(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <div className="flex justify-between py-1">
                    <span>Subtotal</span>
                    <span>₦{order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Delivery Fee</span>
                    <span>₦0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold py-1">
                    <span>Total</span>
                    <span>₦{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" /> Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                    <p>
                      {order.hostelName}, Block {order.blockNumber}, Room {order.roomNo}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivery Status</p>
                    <p>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.orderStatus === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "PROCESSING"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.orderStatus === "COMPLETED"
                          ? "Delivered"
                          : order.orderStatus === "PROCESSING"
                            ? "On the way"
                            : "Preparing"}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Status</p>
                  <p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.orderStatus === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.orderStatus === "COMPLETED" ? "Paid" : "Pending"}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Escrow Status</p>
                  <p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.escrowStatus === "RELEASED"
                          ? "bg-green-100 text-green-800"
                          : order.escrowStatus === "REFUNDED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.escrowStatus}
                    </span>
                  </p>
                </div>

                <Separator />

                <div className="pt-2">
                  {order.paymentMethod === "DELIVERY" && (
                    <Link href={`/chat/${order.id}`} className="w-full">
                      <Button variant="outline" className="w-full mb-3">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat with Seller
                      </Button>
                    </Link>
                  )}

                  {(order.orderStatus === "PENDING" || order.orderStatus === "PROCESSING") && (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        if (confirm("Are you sure you want to cancel this order?")) {
                          // In a real app, this would call an API to cancel the order
                          alert("Order cancellation would happen here")
                        }
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <Link href="/account/orders" className="text-sm text-[#008ECC] hover:underline">
                View all orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

