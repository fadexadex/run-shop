"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/lib/auth-context"
import { Upload, Store, ArrowRight, ArrowLeft } from "lucide-react"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"

export default function SellerOnboarding() {
  const { user, updateSellerStatus, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    catalogueName: "",
    paymentMethod: "ONLINE", // Default value
    cataloguePicture: null as File | null,
  })

  // Update the useEffect to check if we're in the seller auth section
  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading) {
      return
    }

    // If user is not logged in, redirect to login
    if (!user) {
      router.push("/auth/seller?mode=login")
      return
    }

    // If user has already completed seller onboarding, redirect to dashboard
    if (user.sellerCompleted) {
      router.push("/seller/dashboard")
    }
  }, [user, authLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, cataloguePicture: e.target.files?.[0] || null }))
    }
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Create form data for file upload
      const formDataToSend = new FormData()
      formDataToSend.append("catalogueName", formData.catalogueName)
      formDataToSend.append("paymentMethod", formData.paymentMethod)

      if (formData.cataloguePicture) {
        formDataToSend.append("cataloguePicture", formData.cataloguePicture)
      }

      // Get the token from localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      // Make API call to register seller with the token in the Authorization header
      const response = await fetch("http://localhost:6160/api/v1/sellers/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to complete seller registration")
      }

      // Update the user's seller status
      updateSellerStatus(true)

      setSuccess("Seller registration completed successfully! Redirecting to dashboard...")

      // Redirect to seller dashboard after a short delay
      setTimeout(() => {
        router.push("/seller/dashboard")
      }, 2000)
    } catch (error: any) {
      console.error("Error during seller onboarding:", error)
      setError(error.message || "Failed to complete seller registration. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="mb-6">You need to be logged in to complete seller onboarding.</p>
        <Button
          onClick={() => router.push("/auth/seller?mode=login")}
          className="bg-[#008ECC] hover:bg-[#007bb3] text-white"
        >
          Log In
        </Button>
      </div>
    )
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-[#008ECC]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="h-8 w-8 text-[#008ECC]" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Seller Onboarding</h1>
            <p className="text-gray-600">Complete your profile to start selling on RUNShop</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <FormError message={error} />
            <FormSuccess message={success} />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="catalogueName">Catalogue Name</Label>
                <Input
                  id="catalogueName"
                  name="catalogueName"
                  value={formData.catalogueName}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">This is the name that will be displayed to customers.</p>
              </div>

              <div>
                <Label>Payment Method</Label>
                <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ONLINE" id="online" />
                    <Label htmlFor="online" className="cursor-pointer">
                      Online Payment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DELIVERY" id="delivery" />
                    <Label htmlFor="delivery" className="cursor-pointer">
                      Pay on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BOTH" id="both" />
                    <Label htmlFor="both" className="cursor-pointer">
                      Both Methods
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="cataloguePicture" className="block mb-2">
                  Catalogue Picture
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.cataloguePicture ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={URL.createObjectURL(formData.cataloguePicture) || "/placeholder.svg"}
                        alt="Catalogue Picture Preview"
                        className="max-h-32 mb-4 object-contain"
                      />
                      <p className="text-sm text-gray-500">{formData.cataloguePicture.name}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 border-red-300 text-red-500 hover:bg-red-50"
                        onClick={() => setFormData((prev) => ({ ...prev, cataloguePicture: null }))}
                        type="button"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Click or drag and drop to upload</p>
                      <p className="text-xs text-gray-400">PNG, JPG or JPEG (max. 5MB)</p>
                      <input
                        ref={fileInputRef}
                        id="cataloguePicture"
                        name="cataloguePicture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 border-[#008ECC] text-[#008ECC] hover:bg-[#008ECC]/5"
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                      >
                        Select File
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="border-[#008ECC] text-[#008ECC] hover:bg-[#008ECC]/5 flex items-center gap-2"
                  type="button"
                >
                  <ArrowLeft className="h-4 w-4" /> Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#008ECC] hover:bg-[#007bb3] text-white flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Complete Registration"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

