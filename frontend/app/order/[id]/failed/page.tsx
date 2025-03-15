"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { XCircle, ArrowLeft, RefreshCw, ShoppingBag } from "lucide-react"

export default function PaymentFailedPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.id as string

  // Get error message if available
  const errorMessage = searchParams.get("message") || "The payment could not be processed at this time."

  const handleTryAgain = () => {
    router.push(`/order/${orderId}/confirm`)
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-4">{errorMessage}</p>

            <div className="bg-gray-50 p-4 rounded-lg text-left mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-medium">{orderId.slice(0, 8)}...</span>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Don't worry, your order has been saved. You can try again or choose a different payment method.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0">
            <Button onClick={handleTryAgain} className="w-full bg-[#008ECC] hover:bg-[#007bb3] text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Link href="/account" className="w-full">
              <Button variant="outline" className="w-full">
                <ShoppingBag className="h-4 w-4 mr-2" />
                View My Orders
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full">
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

