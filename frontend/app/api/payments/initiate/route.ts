import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.name || !body.amount || !body.orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would call the payment provider's API
    // For the prototype, we'll simulate a successful response

    // Generate a transaction reference
    const transactionRef = "TRX_" + Date.now()

    // Generate a checkout URL
    const checkoutUrl = `https://sandbox-pay.squadco.com/${transactionRef}`

    // Return the response
    return NextResponse.json({
      message: "Payment initiated successfully",
      data: {
        checkoutUrl,
        transactionRef,
      },
    })
  } catch (error) {
    console.error("Error initiating payment:", error)
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 })
  }
}

