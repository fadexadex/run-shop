import { NextResponse } from "next/server"

// This is a mock authentication API endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // In a real app, you would validate credentials against a database
    // For now, we'll just return a mock token

    // Check if the credentials are valid (mock validation)
    if (email && password) {
      // Generate a mock token
      const token = "mock_token_" + Math.random().toString(36).substring(2, 15)

      // Return the token
      return NextResponse.json({
        success: true,
        token,
        user: {
          id: "user123",
          firstName: "John",
          lastName: "Doe",
          email,
          role: email.includes("seller") ? "SELLER" : "CUSTOMER",
        },
      })
    }

    // If credentials are invalid
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 })
  }
}

