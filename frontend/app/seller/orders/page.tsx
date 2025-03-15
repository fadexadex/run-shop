"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, MessageCircle, AlertCircle, ShoppingBag, Check, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Separator } from "@/components/ui/separator"
import { mockOrdersService } from "@/lib/mock-service"
import { useToast } from "@/hooks/use-toast"

export default function SellerOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null)

  useEffect(() => {
    // Redirect if user is not logged in or not a seller
    if (!user) {
      router.push("/auth/seller?mode=login")
      return
    }

    if (user.role !== "SELLER") {
      router.push("/account")
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)

        // Fetch orders for the seller
        const sellerId = user.seller?.id || "seller-1" // Fallback for demo
        const ordersData = await mockOrdersService.getSellerOrders(sellerId)
        setOrders(ordersData)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Failed to load orders. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router, user])

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    setProcessingOrderId(orderId)

    try {
      // Update order status
      const updatedOrder = await mockOrdersService.updateOrderStatus(orderId, status)

      if (updatedOrder) {
        // Update the orders list
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, orderStatus: status } : order)))

        toast({
          title: "Success",
          description: `Order status updated to ${status}`,
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setProcessingOrderId(null)
    }
  }

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
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-[#008ECC] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
              <p className="text-gray-500 mb-6">You haven't received any orders yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                    <div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.orderStatus === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "PROCESSING"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.productId} className="flex items-start">
                        <div className="w-14 h-14 rounded overflow-hidden bg-gray-100 mr-3">
                          <img
                            src={order.product?.imageUrls?.[0] || "/placeholder.svg?height=56&width=56"}
                            alt={order.product?.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">
                            {order.product?.name || `Product #${item.productId.slice(0, 8)}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x ₦{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₦{(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Delivery Details</h3>
                      <p className="text-sm">
                        {order.hostelName}, Block {order.blockNumber}, Room {order.roomNo}
                      </p>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">Payment Method: {order.paymentMethod}</p>
                        <p className="text-sm">
                          Total: <span className="font-bold">₦{order.totalPrice.toFixed(2)}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {order.paymentMethod === "DELIVERY" && (
                          <Link href={`/chat/${order.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              Chat with Customer
                            </Button>
                          </Link>
                        )}

                        {order.orderStatus === "PENDING" && (
                          <Button
                            size="sm"
                            className="bg-[#008ECC] hover:bg-[#007bb3] flex items-center gap-1"
                            onClick={() => handleUpdateOrderStatus(order.id, "PROCESSING")}
                            disabled={processingOrderId === order.id}
                          >
                            {processingOrderId === order.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            Accept Order
                          </Button>
                        )}

                        {order.orderStatus === "PROCESSING" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                            onClick={() => handleUpdateOrderStatus(order.id, "COMPLETED")}
                            disabled={processingOrderId === order.id}
                          >
                            {processingOrderId === order.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            Mark as Delivered
                          </Button>
                        )}

                        {order.orderStatus === "PENDING" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1"
                            onClick={() => handleUpdateOrderStatus(order.id, "CANCELLED")}
                            disabled={processingOrderId === order.id}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

