"use client"

import { useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { mockOrdersService } from "@/lib/mock-service"

export default function PaymentSuccessPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.id as string

  // Get transaction ref from URL if available
  const transactionRef = searchParams.get("reference") || searchParams.get("trxref") || ""

  useEffect(() => {
    // Redirect if user is not logged in
    if (!user && !localStorage.getItem("token")) {
      router.push("/auth/buyer?mode=login")
      return
    }

    // Update order status to PROCESSING
    const updateOrderStatus = async () => {
      try {
        await mockOrdersService.updateOrderStatus(orderId, "PROCESSING")
      } catch (error) {
        console.error("Error updating order status:", error)
      }
    }

    updateOrderStatus()
  }, [user, router, orderId])

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">Your order has been placed successfully and payment has been received.</p>

            <div className="bg-gray-50 p-4 rounded-lg text-left mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-medium">{orderId.slice(0, 8)}...</span>
              </div>
              {transactionRef && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction Reference:</span>
                  <span className="font-medium">{transactionRef}</span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500">A confirmation has been sent to your email address.</p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0">
            <Link href="/account" className="w-full">
              <Button className="w-full bg-[#008ECC] hover:bg-[#007bb3] text-white">
                <ShoppingBag className="h-4 w-4 mr-2" />
                View My Orders
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

