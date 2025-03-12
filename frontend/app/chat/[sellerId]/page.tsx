"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ChatInterface from "@/components/chat/chat-interface"
import RequireAuth from "@/components/auth/require-auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Seller {
  id: string
  name: string
  avatar?: string
}

interface Product {
  id: string
  name: string
}

export default function ChatPage() {
  const params = useParams()
  const sellerId = params.sellerId as string
  const [seller, setSeller] = useState<Seller | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSellerAndProduct = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockSeller: Seller = {
          id: sellerId,
          name: "Campus Threads",
          avatar: "/placeholder.svg?height=200&width=200",
        }

        // Check if there's a product ID in the URL query
        const urlParams = new URLSearchParams(window.location.search)
        const productId = urlParams.get("productId")

        let mockProduct: Product | null = null
        if (productId) {
          mockProduct = {
            id: productId,
            name: "T-Shirt",
          }
        }

        setSeller(mockSeller)
        setProduct(mockProduct)
      } catch (error) {
        console.error("Error fetching seller details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (sellerId) {
      fetchSellerAndProduct()
    }
  }, [sellerId])

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Seller Not Found</h2>
        <p className="mb-6">The seller you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <RequireAuth
        fallback={
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">Login Required</h2>
            <p className="mb-6 text-gray-600">You need to login or create an account to chat with sellers.</p>
            <Button className="bg-black text-white">Login to Continue</Button>
          </div>
        }
      >
        <ChatInterface
          sellerId={seller.id}
          sellerName={seller.name}
          sellerAvatar={seller.avatar}
          productId={product?.id}
          productName={product?.name}
        />
      </RequireAuth>
    </div>
  )
}

