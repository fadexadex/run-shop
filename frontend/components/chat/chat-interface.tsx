"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-context"
import Link from "next/link"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  sellerId: string
  sellerName: string
  sellerAvatar?: string
  productId?: string
  productName?: string
}

export default function ChatInterface({
  sellerId,
  sellerName,
  sellerAvatar,
  productId,
  productName,
}: ChatInterfaceProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simulate fetching chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        if (productId) {
          const mockMessages: Message[] = [
            {
              id: "msg1",
              senderId: sellerId,
              senderName: sellerName,
              senderAvatar: sellerAvatar,
              content: `Hello! Thanks for your interest in ${productName}. How can I help you?`,
              timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            },
          ]
          setMessages(mockMessages)
        } else {
          setMessages([])
        }
      } catch (error) {
        console.error("Error fetching chat history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatHistory()
  }, [sellerId, sellerName, sellerAvatar, productId, productName])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    // Add message to UI immediately
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMsg])
    setNewMessage("")

    // Simulate sending to API
    try {
      // In a real app, you would send the message to your backend here

      // Simulate seller response after a delay
      setTimeout(() => {
        const sellerResponse: Message = {
          id: `msg_${Date.now() + 1}`,
          senderId: sellerId,
          senderName: sellerName,
          senderAvatar: sellerAvatar,
          content: getRandomResponse(),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, sellerResponse])
      }, 2000)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  // Helper function to get random seller responses
  const getRandomResponse = () => {
    const responses = [
      "Thanks for your message! I'll get back to you shortly.",
      "Yes, the item is still available!",
      "Would you like to know more about the product?",
      "I can offer a small discount if you're interested.",
      "When would you like to receive the item?",
      "Do you have any specific questions about the product?",
      "I can deliver it to you on campus if that works for you.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex h-[80vh] flex-col rounded-lg border bg-white">
      {/* Chat header */}
      <div className="flex items-center border-b p-4">
        <Link href={productId ? `/product/${productId}` : "/messages"} className="mr-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <Avatar className="h-10 w-10">
          <AvatarImage src={sellerAvatar || "/placeholder.svg?height=40&width=40"} alt={sellerName} />
          <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h3 className="font-medium">{sellerName}</h3>
          {productName && (
            <Link href={`/product/${productId}`} className="text-sm text-gray-500 hover:underline">
              Re: {productName}
            </Link>
          )}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-2 border-gray-200 border-t-black"></div>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = user?.id === message.senderId

              return (
                <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className="flex max-w-[80%]">
                    {!isCurrentUser && (
                      <Avatar className="mr-2 h-8 w-8">
                        <AvatarImage
                          src={message.senderAvatar || "/placeholder.svg?height=32&width=32"}
                          alt={message.senderName}
                        />
                        <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-lg p-3 ${
                          isCurrentUser ? "bg-black text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{formatTime(message.timestamp)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
            <p>No messages yet</p>
            <p className="mt-1 text-sm">Send a message to start the conversation</p>
          </div>
        )}
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
          />
          <Button type="submit" size="icon" className="h-10 w-10 rounded-full bg-black text-white">
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  )
}

