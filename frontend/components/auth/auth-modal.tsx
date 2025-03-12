"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-context"
import { chatAPI } from "@/lib/api"
import Link from "next/link"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  sentAt: Date
}

interface ChatInterfaceProps {
  chatId?: string
  sellerId: string
  sellerName: string
  sellerAvatar?: string
  productId?: string
  productName?: string
}

export default function ChatInterface({
  chatId: initialChatId,
  sellerId,
  sellerName,
  sellerAvatar,
  productId,
  productName,
}: ChatInterfaceProps) {
  const { user } = useAuth()
  const [chatId, setChatId] = useState<string | undefined>(initialChatId)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch or create chat and load messages
  useEffect(() => {
    const initializeChat = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        let currentChatId = chatId

        // If no chat ID is provided, we need to either find an existing chat or create a new one
        if (!currentChatId) {
          try {
            // Get all user chats
            const chats = await chatAPI.getChats()

            // Find a chat with this seller
            const existingChat = chats.find((chat: any) => chat.sellerId === sellerId)

            if (existingChat) {
              currentChatId = existingChat.id
              setChatId(existingChat.id)
            }
          } catch (error) {
            console.error("Error finding existing chat:", error)
          }
        }

        // If we have a chat ID, load messages
        if (currentChatId) {
          const chatMessages = await chatAPI.getMessages(currentChatId)

          // Format messages for display
          const formattedMessages = chatMessages.map((msg: any) => ({
            id: msg.id,
            senderId: msg.senderId,
            senderName: msg.senderId === user.id ? user.firstName : sellerName,
            senderAvatar: msg.senderId === user.id ? undefined : sellerAvatar,
            content: msg.content,
            sentAt: new Date(msg.sentAt),
          }))

          setMessages(formattedMessages)
        } else {
          // No existing chat found, but we'll create one when the user sends their first message
          setMessages([])
        }
      } catch (error) {
        console.error("Error initializing chat:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeChat()

    // Set up polling for new messages
    const intervalId = setInterval(() => {
      if (chatId) {
        fetchNewMessages()
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(intervalId)
  }, [user, sellerId, chatId])

  // Fetch new messages
  const fetchNewMessages = async () => {
    if (!chatId || !user) return

    try {
      const chatMessages = await chatAPI.getMessages(chatId)

      // Only update if there are new messages
      if (chatMessages.length > messages.length) {
        // Format messages for display
        const formattedMessages = chatMessages.map((msg: any) => ({
          id: msg.id,
          senderId: msg.senderId,
          senderName: msg.senderId === user.id ? user.firstName : sellerName,
          senderAvatar: msg.senderId === user.id ? undefined : sellerAvatar,
          content: msg.content,
          sentAt: new Date(msg.sentAt),
        }))

        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error("Error fetching new messages:", error)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    setIsSending(true)
    try {
      let currentChatId = chatId

      // If we don't have a chat ID yet, create a new chat
      if (!currentChatId) {
        const newChat = await chatAPI.createChat(sellerId, newMessage)
        currentChatId = newChat.id
        setChatId(newChat.id)

        // The initial message is already sent when creating the chat
        const sentMessage = {
          id: newChat.initialMessage.id,
          senderId: user.id,
          senderName: `${user.firstName} ${user.lastName}`,
          content: newMessage,
          sentAt: new Date(),
        }

        setMessages([sentMessage])
      } else {
        // Send message to existing chat
        const sentMessage = await chatAPI.sendMessage(currentChatId, newMessage)

        // Add the new message to the UI
        const newMsg: Message = {
          id: sentMessage.id,
          senderId: user.id,
          senderName: `${user.firstName} ${user.lastName}`,
          content: newMessage,
          sentAt: new Date(sentMessage.sentAt),
        }

        setMessages((prev) => [...prev, newMsg])
      }

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
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
                      <div className="mt-1 text-xs text-gray-500">{formatTime(message.sentAt)}</div>
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
            disabled={isSending}
          />
          <Button type="submit" size="icon" className="h-10 w-10 rounded-full bg-black text-white" disabled={isSending}>
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  )
}

