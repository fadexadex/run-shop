"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-context"
import RequireAuth from "@/components/auth/require-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatPreview {
  id: string
  sellerId: string
  sellerName: string
  sellerAvatar?: string
  lastMessage: string
  timestamp: Date
  unread: boolean
  productId?: string
  productName?: string
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [chats, setChats] = useState<ChatPreview[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockChats: ChatPreview[] = [
          {
            id: "chat1",
            sellerId: "seller1",
            sellerName: "Campus Threads",
            sellerAvatar: "/placeholder.svg?height=200&width=200",
            lastMessage: "Yes, the T-Shirt is still available in medium size.",
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            unread: true,
            productId: "1",
            productName: "T-Shirt",
          },
          {
            id: "chat2",
            sellerId: "seller2",
            sellerName: "Campus Eats",
            sellerAvatar: "/placeholder.svg?height=200&width=200",
            lastMessage: "Your order will be ready for pickup in 15 minutes.",
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            unread: false,
            productId: "4",
            productName: "Jollof Rice",
          },
          {
            id: "chat3",
            sellerId: "seller3",
            sellerName: "Tech Gear",
            sellerAvatar: "/placeholder.svg?height=200&width=200",
            lastMessage: "We just got new headphones in stock if you're still interested.",
            timestamp: new Date(Date.now() - 172800000), // 2 days ago
            unread: false,
            productId: "7",
            productName: "Headphones",
          },
        ]

        setChats(mockChats)
      } catch (error) {
        console.error("Error fetching chats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChats()
  }, [user])

  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Messages</h1>

      <RequireAuth
        fallback={
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">Login Required</h2>
            <p className="mb-6 text-gray-600">You need to login or create an account to view your messages.</p>
            <Button className="bg-black text-white">Login to Continue</Button>
          </div>
        }
      >
        {isLoading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-black"></div>
          </div>
        ) : chats.length > 0 ? (
          <div className="rounded-lg border bg-white">
            {chats.map((chat, index) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.sellerId}${chat.productId ? `?productId=${chat.productId}` : ""}`}
              >
                <div
                  className={`flex cursor-pointer items-center gap-4 p-4 hover:bg-gray-50 ${index !== chats.length - 1 ? "border-b" : ""}`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={chat.sellerAvatar || "/placeholder.svg?height=48&width=48"}
                      alt={chat.sellerName}
                    />
                    <AvatarFallback>{chat.sellerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{chat.sellerName}</h3>
                      <span className="text-xs text-gray-500">{formatTime(chat.timestamp)}</span>
                    </div>
                    {chat.productName && <p className="text-xs text-gray-500">Re: {chat.productName}</p>}
                    <p className={`mt-1 truncate text-sm ${chat.unread ? "font-semibold" : "text-gray-600"}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread && <div className="h-2.5 w-2.5 rounded-full bg-black"></div>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-white p-8 text-center">
            <p className="mb-4 text-gray-600">You don't have any messages yet.</p>
            <Link href="/products">
              <Button className="bg-black text-white">Browse Products</Button>
            </Link>
          </div>
        )}
      </RequireAuth>
    </div>
  )
}

