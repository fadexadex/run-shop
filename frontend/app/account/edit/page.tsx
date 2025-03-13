"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function EditProfile() {
  const { user, isLoading, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    shippingAddress: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        shippingAddress: user.shippingAddress || "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsSaving(true)

    try {
      await updateProfile(formData)
      setSuccessMessage("Profile updated successfully")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/account")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
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
        <p className="mb-6">You need to be logged in to edit your profile.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    )
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

            {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

            {successMessage && (
              <div className="bg-green-50 text-green-500 p-3 rounded mb-4 text-sm">{successMessage}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="shippingAddress" className="block text-sm font-medium mb-2">
                  Shipping Address
                </label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-black text-white" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>

                <Link href="/account">
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

