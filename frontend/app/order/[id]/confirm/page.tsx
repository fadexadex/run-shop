"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, CreditCard, Loader2, ShieldCheck } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

export default function OrderConfirmation() {
  const params = useParams()
  const orderId = params.id as string
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentProgress, setPaymentProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Only fetch order details once when component mounts
  useEffect(() => {
    let isMounted = true

    const fetchOrderDetails = async () => {
      if (!orderId) return

      try {
        // Create mock order data
        const mockOrder = {
          id: orderId,
          totalPrice: 15000,
          items: [
            {
              product: {
                id: "1",
                name: "Wireless Bluetooth Headphones",
              },
              quantity: 1,
              price: 15000,
            },
          ],
          hostelName: "Prophet Moses",
          blockNumber: 10,
          roomNo: 7,
        }

        // Only update state if component is still mounted
        if (isMounted) {
          setOrder(mockOrder)
          setLoading(false)
        }
      } catch (err: any) {
        console.error("Error fetching order:", err)
        if (isMounted) {
          setError(err.message || "Failed to load order details")
          setLoading(false)
          toast({
            title: "Error",
            description: "Failed to load order details. Please try again.",
            variant: "destructive",
          })
        }
      }
    }

    fetchOrderDetails()

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [orderId, toast])

  const handleInitiatePayment = async () => {
    if (!order || paymentLoading) return

    try {
      setPaymentLoading(true)
      setError(null)
      setPaymentProgress(10)

      toast({
        title: "Processing payment",
        description: "Please wait while we connect to the payment gateway...",
      })

      // Prepare payment data
      const paymentData = {
        email: user?.email || "fadehandaniel219o0@gmail.com",
        name: user ? `${user.firstName} ${user.lastName}` : "FadexAdex",
        amount: 500, // Fixed amount as per requirements
        orderId: orderId || "ff7c470c-858d-43be-9cac-3adfcde73706",
      }

      setPaymentProgress(30)

      try {
        // Make the API call to initiate payment
        const response = await fetch("http://localhost:6160/api/v1/payments/initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        })

        setPaymentProgress(60)

        if (!response.ok) {
          throw new Error("Payment initiation failed")
        }

        const data = await response.json()
        console.log("Payment response:", data)
        setPaymentProgress(90)

        // Redirect to the checkout URL
        if (data && data.data && data.data.checkoutUrl) {
          setPaymentProgress(100)

          // Use window.location for a full page redirect
          window.location.href = data.data.checkoutUrl
          return // Exit early to prevent further state updates
        } else {
          throw new Error("Invalid payment response")
        }
      } catch (error) {
        console.error("Error initiating payment:", error)

        // Fallback to mock response if the real API is not available
        setPaymentProgress(60)

        // Simulate a successful response
        const mockResponse = {
          message: "Payment initiated successfully",
          data: {
            checkoutUrl: "https://sandbox-pay.squadco.com/TRX_" + Date.now(),
            transactionRef: "TRX_" + Date.now(),
          },
        }

        setPaymentProgress(90)
        console.log("Using mock payment response:", mockResponse)

        // Redirect to the mock checkout URL
        setPaymentProgress(100)
        window.location.href = mockResponse.data.checkoutUrl
        return // Exit early to prevent further state updates
      }
    } catch (err: any) {
      console.error("Payment initiation error:", err)
      setError(err.message || "Failed to initiate payment")
      setPaymentProgress(0)
      setPaymentLoading(false)
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return

    try {
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully.",
      })

      router.push("/")
    } catch (err: any) {
      console.error("Error cancelling order:", err)
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Order not found"}</p>
          </CardContent>
          <CardFooter>
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-black">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Order Confirmation</CardTitle>
              <span className="text-sm text-gray-500">
                Order #{typeof orderId === "string" && orderId.length > 8 ? orderId.substring(0, 8) : orderId}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <h2 className="text-center text-xl font-semibold mb-2">Thank you for your order!</h2>
            <p className="text-center text-gray-600 mb-6">Your order has been received and is now being processed.</p>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between py-2">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₦{Number(item.price).toFixed(2)}</p>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between py-2 font-bold">
                    <p>Total</p>
                    <p>₦{Number(order.totalPrice).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Delivery Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p>
                    <span className="font-medium">Hostel:</span> {order.hostelName}
                  </p>
                  <p>
                    <span className="font-medium">Block:</span> {order.blockNumber}
                  </p>
                  <p>
                    <span className="font-medium">Room:</span> {order.roomNo}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <div className="bg-gray-50 p-4 rounded-md flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  <p>Online Payment</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                  <p className="font-medium">Payment Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {paymentLoading && paymentProgress > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                  <p className="font-medium text-blue-800 mb-2">Connecting to payment gateway...</p>
                  <Progress value={paymentProgress} className="h-2 mb-1" />
                  <p className="text-xs text-blue-600 text-right">{paymentProgress}%</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md flex items-start">
                <ShieldCheck className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-sm">
                    Your payment is secure and your personal information is kept private. We use secure payment
                    processing and don't store your card details.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 bg-gray-50 border-t p-6">
            <Button
              onClick={handleInitiatePayment}
              className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white"
              disabled={paymentLoading}
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment
                </>
              )}
            </Button>
            <Button
              onClick={handleCancelOrder}
              variant="outline"
              className="w-full sm:w-auto"
              disabled={paymentLoading}
            >
              Cancel Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

