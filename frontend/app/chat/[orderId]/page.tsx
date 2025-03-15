"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, ShoppingBag, User, Loader2, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Mock data to prevent re-fetching
const MOCK_MESSAGES = [
  {
    id: 1,
    senderId: "user1",
    receiverId: "seller1",
    content: "Hi, I just ordered a T-shirt. When can I expect delivery?",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 2,
    senderId: "seller1",
    receiverId: "user1",
    content: "Hello! Thanks for your order. I can deliver it tomorrow around 2pm. Does that work for you?",
    timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
  },
  {
    id: 3,
    senderId: "user1",
    receiverId: "seller1",
    content: "That works perfectly. See you then!",
    timestamp: new Date(Date.now() - 2400000).toISOString(), // 40 minutes ago
  },
]

// Mock order data
const createMockOrder = (orderId) => ({
  id: orderId,
  userId: "user1",
  sellerId: "seller1",
  totalPrice: 15000,
  orderStatus: "PENDING",
  paymentMethod: "DELIVERY",
  escrowStatus: "HELD",
  items: [
    {
      product: {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        price: 15000,
      },
      quantity: 1,
      price: 15000,
    },
  ],
  seller: {
    id: "seller1",
    catalogueName: "Tech Store",
  },
  buyer: {
    id: "user1",
    firstName: "Demo",
    lastName: "User",
  },
  hostelName: "Prophet Moses",
  blockNumber: 10,
  roomNo: 7,
})

export default function ChatPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const [order, setOrder] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  // Load data only once on mount
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        // Simulate a short delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (isMounted) {
          setOrder(createMockOrder(orderId))
          setMessages(MOCK_MESSAGES)
          setLoading(false)
        }
      } catch (err) {
        console.error("Error loading chat data:", err)
        if (isMounted) {
          setError("Failed to load chat data")
          setLoading(false)
          toast({
            title: "Error",
            description: "Failed to load chat data. Please try again.",
            variant: "destructive",
          })
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [orderId, toast])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && !loading) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, loading])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !order || sendingMessage) return

    try {
      setSendingMessage(true)

      // Create a new message
      const newMsg = {
        id: Date.now(),
        senderId: "user1", // Always use user1 for demo
        receiverId: "seller1",
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
      }

      // Clear input first to prevent multiple submissions
      setNewMessage("")

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Add to messages
      setMessages((prevMessages) => [...prevMessages, newMsg])
    } catch (err) {
      console.error("Error sending message:", err)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSendingMessage(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCompleteOrder = async () => {
    if (!order) return

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update order status
      setOrder((prevOrder) => ({
        ...prevOrder,
        orderStatus: "COMPLETED",
        escrowStatus: "RELEASED",
      }))

      toast({
        title: "Order Completed",
        description: "The order has been marked as completed and payment released.",
      })
    } catch (err) {
      console.error("Error completing order:", err)
      toast({
        title: "Error",
        description: "Failed to complete order. Please try again.",
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

  const isBuyer = true // Always show buyer view for demo
  const otherParty = order.seller

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-black">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-md h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="bg-gray-50 border-b py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  {isBuyer ? (
                    <ShoppingBag className="h-5 w-5 text-gray-600" />
                  ) : (
                    <User className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {isBuyer
                      ? `Chat with ${otherParty?.catalogueName || "Seller"}`
                      : `Chat with ${otherParty?.firstName || ""} ${otherParty?.lastName || "Buyer"}`}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Order #{typeof orderId === "string" && orderId.length > 8 ? orderId.substring(0, 8) : orderId}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  order.orderStatus === "COMPLETED"
                    ? "success"
                    : order.orderStatus === "CANCELLED"
                      ? "destructive"
                      : "outline"
                }
              >
                {order.orderStatus}
              </Badge>
            </div>
          </CardHeader>

          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Order Details</h3>
              <span className="text-sm font-medium">₦{Number(order.totalPrice).toFixed(2)}</span>
            </div>
            <div className="mt-2 text-sm">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between py-1">
                  <span>
                    {item.quantity}x {item.product.name}
                  </span>
                  <span>₦{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <CardContent className="flex-grow overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isCurrentUser = message.senderId === "user1"
                  return (
                    <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isCurrentUser
                            ? "bg-black text-white rounded-tr-none"
                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${isCurrentUser ? "text-gray-300" : "text-gray-500"}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {order.orderStatus === "PENDING" && order.paymentMethod === "DELIVERY" && isBuyer && (
            <div className="px-4 py-3 bg-green-50 border-t border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-sm text-green-800">Confirm when you've received the item and made payment</p>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleCompleteOrder}>
                  Complete Order
                </Button>
              </div>
            </div>
          )}

          {order.orderStatus === "PENDING" && (
            <CardFooter className="p-4 border-t">
              <div className="flex w-full gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={sendingMessage}
                  className="flex-grow"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="bg-black hover:bg-gray-800"
                >
                  {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardFooter>
          )}

          {order.orderStatus !== "PENDING" && (
            <div className="p-4 border-t bg-gray-50 text-center text-gray-500">
              <p>This conversation is closed because the order is {order.orderStatus.toLowerCase()}.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

