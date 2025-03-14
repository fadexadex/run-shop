"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Loader2, Package, ShoppingBag, Tag, Plus, Edit, Trash2, Settings, BarChart, AlertCircle } from "lucide-react"

interface Product {
  id: string
  name: string
  price: string
  stockQuantity: number
  imageUrls: string[]
  createdAt: string
  category?: {
    id: string
    name: string
  }
}

// Update the Order interface to match the actual API response
// Replace the existing Order interface with this:
interface Order {
  id: string
  userId?: string
  sellerId?: string
  productId?: string
  product?: {
    name: string
    price: string
    imageUrls: string[]
  }
  quantity?: number
  totalPrice?: string
  status: string
  orderStatus?: string
  paymentMethod: string
  escrowStatus?: string
  createdAt: string
  updatedAt?: string
  hostelName?: string
  blockNumber?: number
  roomNo?: number
}

interface SellerProfile {
  id: string
  userId: string
  catalogueName: string
  cataloguePicture?: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
  products?: Product[]
}

export default function SellerDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "overview"

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })

  // Update the useEffect to check sellerCompleted
  useEffect(() => {
    // If user is not logged in, wait for loading to complete
    if (authLoading) {
      return
    }

    // If user is not logged in after loading completes, redirect to login
    if (!user) {
      router.push("/auth/seller?mode=login")
      return
    }

    // If user has not completed seller onboarding, redirect to onboarding
    if (!user.sellerCompleted) {
      router.push("/seller/onboarding")
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Get token
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        // Fetch user profile with seller data
        const userResponse = await fetch("http://localhost:6160/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user profile")
        }

        const userData = await userResponse.json()
        console.log("API response from /auth/me:", userData)

        // Check if the response has the expected structure
        if (!userData.seller) {
          console.error("Unexpected API response structure:", userData)
          throw new Error("Seller profile not found")
        }

        const seller = userData.seller
        console.log("Seller data extracted:", seller)
        setSellerProfile(seller)

        // Fetch seller's catalogue
        const catalogueResponse = await fetch(`http://localhost:6160/api/v1/sellers/${seller.id}/catalogue`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (catalogueResponse.ok) {
          const catalogueData = await catalogueResponse.json()
          setProducts(catalogueData.products || [])

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalProducts: catalogueData.products?.length || 0,
          }))
        } else {
          console.error("Failed to fetch catalogue")
          setProducts([])
        }

        // Try to fetch orders
        try {
          // Use the correct endpoint for fetching seller orders
          const ordersResponse = await fetch(`http://localhost:6160/api/v1/orders/${seller.id}/seller`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json()
            console.log("Orders data:", ordersData)

            // Check if the response is an array directly or nested in a data property
            const ordersList = Array.isArray(ordersData) ? ordersData : ordersData.data || []

            // Map the orders to match our expected format
            const formattedOrders = ordersList.map((order: any) => {
              return {
                id: order.id,
                productId: order.productId || "",
                quantity: order.quantity || 1,
                status: order.orderStatus || "PENDING",
                paymentMethod: order.paymentMethod || "ONLINE",
                createdAt: order.createdAt,
                totalPrice: order.totalPrice,
                escrowStatus: order.escrowStatus,
                hostelName: order.hostelName,
                blockNumber: order.blockNumber,
                roomNo: order.roomNo,
                // If product details are not included in the order, create a placeholder
                product: order.product || {
                  name: "Product",
                  price: order.totalPrice || "0",
                  imageUrls: [],
                },
              }
            })

            setOrders(formattedOrders)

            // Calculate total revenue
            const totalRevenue = ordersList.reduce((sum: number, order: any) => {
              return sum + Number(order.totalPrice || 0)
            }, 0)

            setStats((prev) => ({
              ...prev,
              totalOrders: ordersList.length,
              totalRevenue,
            }))
          } else {
            console.error("Failed to fetch orders")
          }
        } catch (err) {
          console.error("Error fetching orders:", err)
          // If orders endpoint fails, we still have the dashboard with products
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError(error instanceof Error ? error.message : "Failed to load seller dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, authLoading, router])

  const handleTabChange = (value: string) => {
    router.push(`/seller/dashboard?tab=${value}`)
  }

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(`http://localhost:6160/api/v1/sellers/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      // Remove product from state
      setProducts(products.filter((p) => p.id !== productId))

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalProducts: prev.totalProducts - 1,
      }))

      alert("Product deleted successfully")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product. Please try again.")
    }
  }

  if (!user) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="mb-6">You need to be logged in as a seller to access the dashboard.</p>
        <Button
          onClick={() => router.push("/auth/seller?mode=login")}
          className="bg-[#008ECC] hover:bg-[#007bb3] text-white"
        >
          Log In as Seller
        </Button>
      </div>
    )
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
        <p className="mb-6 text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (!sellerProfile) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Seller Profile Not Found</h2>
        <p className="mb-6">You need to complete your seller profile setup.</p>
        <Button
          onClick={() => router.push("/seller/onboarding")}
          className="bg-[#008ECC] hover:bg-[#007bb3] text-white"
        >
          Complete Setup
        </Button>
      </div>
    )
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <div className="flex items-center gap-4">
            {sellerProfile.cataloguePicture && (
              <img
                src={sellerProfile.cataloguePicture || "/placeholder.svg"}
                alt={sellerProfile.catalogueName}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="font-semibold">{sellerProfile.catalogueName}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-[#008ECC] mr-2" />
                    <span className="text-2xl font-bold">{stats.totalProducts}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 text-[#008ECC] mr-2" />
                    <span className="text-2xl font-bold">{stats.totalOrders}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 text-[#008ECC] mr-2" />
                    <span className="text-2xl font-bold">₦{stats.totalRevenue.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Products</CardTitle>
                  <CardDescription>Your most recently added products</CardDescription>
                </CardHeader>
                <CardContent>
                  {products.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No products added yet</p>
                  ) : (
                    <div className="space-y-4">
                      {products.slice(0, 5).map((product) => (
                        <div key={product.id} className="flex items-center gap-4 border-b pb-4">
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={product.imageUrls?.[0] || "/placeholder.svg?height=48&width=48"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                            <p className="text-sm text-gray-500">₦{Number(product.price).toFixed(2)}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleTabChange("products")}>
                    View All Products
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your most recent customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No orders received yet</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center gap-4 border-b pb-4">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            {order.product && order.product.imageUrls && order.product.imageUrls.length > 0 ? (
                              <img
                                src={order.product.imageUrls[0] || "/placeholder.svg?height=40&width=40"}
                                alt="Product"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ShoppingBag className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {order.product && order.product.name
                                ? order.product.name
                                : `Order #${order.id.slice(0, 6)}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              ₦
                              {typeof order.product === "object" && order.product.price
                                ? (Number(order.product.price) * (order.quantity || 1)).toFixed(2)
                                : Number(order.totalPrice || 0).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleTabChange("orders")}>
                    View All Orders
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Your Products</h2>
                <div className="flex gap-2">
                  <Link href="/seller/categories">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Manage Categories
                    </Button>
                  </Link>
                  <Link href="/seller/products/new">
                    <Button className="bg-[#008ECC] hover:bg-[#007bb3] text-white flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add New Product
                    </Button>
                  </Link>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Products Yet</h3>
                  <p className="text-gray-500 mb-6">Start adding products to your store</p>
                  <Link href="/seller/products/new">
                    <Button className="bg-[#008ECC] hover:bg-[#007bb3] text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date Added</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                  src={product.imageUrls?.[0] || "/placeholder.svg?height=40&width=40"}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">{product.category?.name || "Uncategorized"}</td>
                          <td className="px-4 py-4 text-sm">₦{Number(product.price).toFixed(2)}</td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                product.stockQuantity > 10
                                  ? "bg-green-100 text-green-800"
                                  : product.stockQuantity > 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.stockQuantity} in stock
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/seller/products/edit/${product.id}`)}
                                className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Your Orders</h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                  <p className="text-gray-500">Orders will appear here when customers make purchases</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Payment</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Escrow</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Delivery</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-mono">{order.id.slice(0, 8)}...</td>
                          <td className="px-4 py-4 text-sm">
                            ₦
                            {typeof order.product === "object" && order.product.price
                              ? (Number(order.product.price) * (order.quantity || 1)).toFixed(2)
                              : Number(order.totalPrice || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.status === "PROCESSING"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">{order.paymentMethod}</td>
                          <td className="px-4 py-4 text-sm">{order.escrowStatus || "N/A"}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {order.hostelName
                              ? `${order.hostelName}, Block ${order.blockNumber}, Room ${order.roomNo}`
                              : "N/A"}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                // View order details
                                alert("Order details view would open here")
                              }}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Store Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Profile</CardTitle>
                    <CardDescription>Manage your store information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Store Name</p>
                        <p className="font-medium">{sellerProfile.catalogueName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Payment Method</p>
                        <p>
                          {sellerProfile.paymentMethod === "ONLINE"
                            ? "Online Payment"
                            : sellerProfile.paymentMethod === "DELIVERY"
                              ? "Pay on Delivery"
                              : "Both Methods"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Store Created</p>
                        <p>{new Date(sellerProfile.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => router.push("/seller/profile")}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Store Profile
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>Manage product categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      Create and manage categories to organize your products and help customers browse your store.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/seller/categories" className="w-full">
                      <Button variant="outline" className="w-full">
                        <Tag className="h-4 w-4 mr-2" />
                        Manage Categories
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

