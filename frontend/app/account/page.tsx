"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { ordersApi } from "@/lib/api"

interface Order {
  id: string
  productId: string
  quantity: number
  status: string
  paymentMethod: string
  createdAt: string
  product: {
    name: string
    price: string
    imageUrls: string[]
  }
}

export default function Account() {
  const { user, isLoading, logout } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await ordersApi.getOrders()
        setOrders(response.data || [])
      } catch (err) {
        setError("Error loading orders. Please try again later.")
        console.error("Error fetching orders:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (isLoading) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="mb-6">You need to be logged in to view your account.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    )
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-gray-600">
              Welcome back, {user.firstName} {user.lastName}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Log Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order History</h2>

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                  <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              order.product.imageUrls && order.product.imageUrls.length > 0
                                ? order.product.imageUrls[0]
                                : "/placeholder.svg?height=100&width=100"
                            }
                            alt={order.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{order.product.name}</h3>
                            <p className="text-sm text-gray-500">
                              Ordered on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                              Quantity: {order.quantity} · $
                              {(Number.parseFloat(order.product.price) * order.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col items-end">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "PROCESSING"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                          </span>
                          <p className="text-sm mt-1">
                            {order.paymentMethod === "ONLINE" ? "Paid Online" : "Pay on Delivery"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
                  <Link href="/products">
                    <Button className="mt-4">Browse Products</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Account Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping Address</p>
                  <p>{user.shippingAddress || "No address provided"}</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/account/edit">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link href="/wishlist" className="block text-blue-600 hover:underline">
                  My Wishlist
                </Link>
                <Link href="/products" className="block text-blue-600 hover:underline">
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

