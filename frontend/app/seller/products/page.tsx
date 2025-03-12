"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-context"
import { sellerAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Edit, Trash2, Plus } from "lucide-react"
import RequireAuth from "@/components/auth/require-auth"

export default function SellerProductsPage() {
  const { user, isAuthenticated } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSellerProducts = async () => {
      if (!user?.sellerId) return

      setIsLoading(true)
      try {
        const productsData = await sellerAPI.getSellerProducts(user.sellerId)
        setProducts(productsData)
      } catch (err) {
        console.error("Error fetching seller products:", err)
        setError("Failed to load your products. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated && user?.role === "SELLER") {
      fetchSellerProducts()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const handleDeleteProduct = async (productId: string) => {
    if (!user?.sellerId) return

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await sellerAPI.deleteProduct(user.sellerId, productId)
        setProducts(products.filter((product) => product.id !== productId))
      } catch (err) {
        console.error("Error deleting product:", err)
        alert("Failed to delete product. Please try again.")
      }
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Link href="/seller/add-product">
          <Button className="bg-black text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      <RequireAuth
        fallback={
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">Login Required</h2>
            <p className="mb-6 text-gray-600">You need to login as a seller to view your products.</p>
          </div>
        }
      >
        {(isAuthenticated) => {
          if (user?.role !== "SELLER") {
            return (
              <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <h2 className="mb-4 text-2xl font-bold">Seller Account Required</h2>
                <p className="mb-6 text-gray-600">
                  You need a seller account to manage products. Please register as a seller.
                </p>
              </div>
            )
          }

          if (isLoading) {
            return (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
              </div>
            )
          }

          if (error) {
            return (
              <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            )
          }

          if (products.length === 0) {
            return (
              <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">No Products Yet</h2>
                <p className="mb-6 text-gray-600">You haven't added any products to your catalogue yet.</p>
                <Link href="/seller/add-product">
                  <Button className="bg-black text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            )
          }

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden rounded-lg border">
                  <div className="relative h-48 overflow-hidden">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <img
                        src={product.imageUrls[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="/placeholder.svg?height=400&width=300"
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm">{product.category?.name}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stockQuantity} units</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold">${Number.parseFloat(product.price).toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Link href={`/seller/edit-product/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )
        }}
      </RequireAuth>
    </div>
  )
}

