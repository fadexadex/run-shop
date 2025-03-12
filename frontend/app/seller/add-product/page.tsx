"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import AddProductForm from "@/components/seller/add-product-form"
import RequireAuth from "@/components/auth/require-auth"

export default function AddProductPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if user is not a seller
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== "SELLER") {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, user, router])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      <RequireAuth
        fallback={
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">Login Required</h2>
            <p className="mb-6 text-gray-600">You need to login as a seller to add products.</p>
          </div>
        }
      >
        {(isAuthenticated) => {
          if (user?.role !== "SELLER") {
            return (
              <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <h2 className="mb-4 text-2xl font-bold">Seller Account Required</h2>
                <p className="mb-6 text-gray-600">
                  You need a seller account to add products. Please register as a seller.
                </p>
              </div>
            )
          }

          return <AddProductForm />
        }}
      </RequireAuth>
    </div>
  )
}

