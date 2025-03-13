"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Send } from "lucide-react"

interface Message {
  id: number
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  orderId?: number
}

interface Conversation {
  [key: string]: Message[]
}

export default function Messages() {
  const { user, isLoading: authLoading } = useAuth()
  const [conversations, setConversations] = useState<Conversation>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await fetch("/api/messages")

        if (!response.ok) {
          throw new Error("Failed to fetch messages")
        }

        const data = await response.json()
        setConversations(data)

        // Set first conversation as active if there are any
        const conversationKeys = Object.keys(data)
        if (conversationKeys.length > 0 && !activeConversation) {
          setActiveConversation(conversationKeys[0])
        }
      } catch (err) {
        setError("Error loading messages. Please try again later.")
        console.error("Error fetching messages:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [user, activeConversation])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!activeConversation || !newMessage.trim()) return

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: activeConversation,
          content: newMessage,
        }),
      })

      if (response.ok) {
        const sentMessage = await response.json()

        // Update conversations state
        setConversations((prev) => ({
          ...prev,
          [activeConversation]: [...(prev[activeConversation] || []), sentMessage],
        }))

        setNewMessage("")
      } else {
        throw new Error("Failed to send message")
      }
    } catch (err) {
      console.error("Error sending message:", err)
      alert("Failed to send message. Please try again.")
    }
  }

  if (authLoading) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="mb-6">You need to be logged in to view your messages.</p>
        <Button href="/login" as="a">
          Log In
        </Button>
      </div>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        ) : Object.keys(conversations).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Conversation List */}
            <div className="md:col-span-1 border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 border-b">
                <h2 className="font-semibold">Conversations</h2>
              </div>
              <div className="divide-y">
                {Object.keys(conversations).map((receiverId) => {
                  const messages = conversations[receiverId]
                  const lastMessage = messages[messages.length - 1]

                  return (
                    <div
                      key={receiverId}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${
                        activeConversation === receiverId ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setActiveConversation(receiverId)}
                    >
                      <div className="font-medium">
                        {receiverId.startsWith("seller") ? `Seller ${receiverId.replace("seller", "")}` : receiverId}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{lastMessage.content}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(lastMessage.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Message View */}
            <div className="md:col-span-3 border rounded-lg flex flex-col h-[600px]">
              {activeConversation ? (
                <>
                  <div className="bg-gray-100 p-3 border-b">
                    <h2 className="font-semibold">
                      {activeConversation.startsWith("seller")
                        ? `Seller ${activeConversation.replace("seller", "")}`
                        : activeConversation}
                    </h2>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversations[activeConversation].map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === user.id ? "bg-blue-500 text-white" : "bg-gray-200"
                          }`}
                        >
                          <div>{message.content}</div>
                          <div
                            className={`text-xs mt-1 ${
                              message.senderId === user.id ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {formatTimestamp(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t">
                    <form onSubmit={sendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-md"
                      />
                      <Button type="submit" className="bg-black">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600 mb-4">You don&apos;t have any messages yet.</p>
            <p className="text-gray-500 mb-6">
              Start a conversation by viewing a product and chatting with the seller.
            </p>
            <Button href="/products" as="a">
              Browse Products
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

