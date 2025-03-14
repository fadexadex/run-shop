"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { ordersApi } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ShoppingBag, Heart, Clock, User, LogOut, Settings } from "lucide-react"

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

export default function BuyerDashboard() {
  const { user, isLoading, logout } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Check if user is a seller and redirect if necessary
    if (user && user.role === "SELLER") {
      window.location.href = "/seller/dashboard"
      return
    }

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
        <Loader2 className="h-12 w-12 animate-spin text-[#008ECC]" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="mb-6">You need to be logged in to view your account.</p>
        <Link href="/auth/buyer?mode=login">
          <Button className="bg-[#008ECC] hover:bg-[#007bb3] text-white">Log In</Button>
        </Link>
      </div>
    )
  }

  return (
    <section className="w-full py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#008ECC]/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-[#008ECC]" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "overview" ? "bg-[#008ECC] text-white" : "text-gray-700"}`}
                  onClick={() => setActiveTab("overview")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Overview
                </Button>
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "orders" ? "bg-[#008ECC] text-white" : "text-gray-700"}`}
                  onClick={() => setActiveTab("orders")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button
                  variant={activeTab === "wishlist" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "wishlist" ? "bg-[#008ECC] text-white" : "text-gray-700"}`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "settings" ? "bg-[#008ECC] text-white" : "text-gray-700"}`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    logout()
                    window.location.href = "/"
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </nav>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions or need assistance, our support team is here to help.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Welcome back, {user.firstName}!</h2>
                  <p className="text-gray-600 mb-6">Here's a summary of your recent activity on RUNShop.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center">
                        <ShoppingBag className="h-8 w-8 text-[#008ECC] mb-2" />
                        <h3 className="font-semibold text-lg">{orders.length}</h3>
                        <p className="text-sm text-gray-500">Total Orders</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center">
                        <Heart className="h-8 w-8 text-[#008ECC] mb-2" />
                        <h3 className="font-semibold text-lg">{user.wishlist?.length || 0}</h3>
                        <p className="text-sm text-gray-500">Wishlist Items</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center">
                        <Clock className="h-8 w-8 text-[#008ECC] mb-2" />
                        <h3 className="font-semibold text-lg">
                          {orders.filter((order) => order.status === "PENDING").length}
                        </h3>
                        <p className="text-sm text-gray-500">Pending Orders</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Recent Orders</h2>
                    <Button variant="ghost" className="text-[#008ECC]" onClick={() => setActiveTab("orders")}>
                      View All
                    </Button>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#008ECC]" />
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
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
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">You haven't placed any orders yet.</p>
                      <Link href="/products">
                        <Button className="mt-4 bg-[#008ECC] hover:bg-[#007bb3] text-white">Browse Products</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Order History</h2>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-[#008ECC]" />
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
                            <Button variant="ghost" size="sm" className="mt-2">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">You haven't placed any orders yet.</p>
                    <Link href="/products">
                      <Button className="mt-4 bg-[#008ECC] hover:bg-[#007bb3] text-white">Browse Products</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">My Wishlist</h2>

                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Your wishlist items will appear here.</p>
                  <Link href="/products">
                    <Button className="mt-4 bg-[#008ECC] hover:bg-[#007bb3] text-white">Browse Products</Button>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input type="text" className="w-full p-2 border rounded-md" defaultValue={user.firstName} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input type="text" className="w-full p-2 border rounded-md" defaultValue={user.lastName} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full p-2 border rounded-md bg-gray-50"
                          defaultValue={user.email}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
                      <input type="text" className="w-full p-2 border rounded-md" defaultValue={user.hostelName} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Block Number</label>
                        <input type="number" className="w-full p-2 border rounded-md" defaultValue={user.blockNumber} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                        <input type="number" className="w-full p-2 border rounded-md" defaultValue={user.roomNo} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Password</h3>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="bg-[#008ECC] hover:bg-[#007bb3] text-white">Save Changes</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

