import { NextResponse } from "next/server"
import { messages } from "@/lib/db"

// Mock current user - in a real app, this would come from authentication
const CURRENT_USER_ID = "user1"

export async function GET() {
  // Get messages for the current user (sent or received)
  const userMessages = messages.filter((msg) => msg.senderId === CURRENT_USER_ID || msg.receiverId === CURRENT_USER_ID)

  // Group messages by conversation
  const conversations: Record<string, any[]> = {}

  userMessages.forEach((msg) => {
    const otherParty = msg.senderId === CURRENT_USER_ID ? msg.receiverId : msg.senderId

    if (!conversations[otherParty]) {
      conversations[otherParty] = []
    }

    conversations[otherParty].push(msg)
  })

  // Sort messages in each conversation by timestamp
  Object.keys(conversations).forEach((key) => {
    conversations[key].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  })

  return NextResponse.json(conversations)
}

export async function POST(request: Request) {
  const { receiverId, content, orderId } = await request.json()

  // Create new message
  const newMessage = {
    id: messages.length + 1,
    senderId: CURRENT_USER_ID,
    receiverId,
    content,
    timestamp: new Date().toISOString(),
    orderId,
  }

  messages.push(newMessage)

  return NextResponse.json(newMessage, { status: 201 })
}

