"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the email to an API
    setSubmitted(true)
  }

  return (
    <section className="w-full py-12 md:py-16 border-t">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <Bell className="h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold md:text-3xl mb-4">Stay Updated</h2>
          <p className="text-gray-600 max-w-md mb-8">
            Subscribe to get notified about new products, promotions, and campus events.
          </p>

          {submitted ? (
            <div className="bg-green-50 text-green-700 px-6 py-4 rounded-lg max-w-md">
              <p className="font-medium">Thanks for subscribing!</p>
              <p className="text-sm mt-1">We'll keep you updated with the latest from RUNShop.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" className="bg-black text-white">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">We respect your privacy. Unsubscribe at any time.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

