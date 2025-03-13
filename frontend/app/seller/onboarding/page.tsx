"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { CheckCircle2, Upload } from "lucide-react"

export default function SellerOnboarding() {
  const { user } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    phoneNumber: "",
    bankName: "",
    accountNumber: "",
    categories: [] as string[],
    logo: null as File | null,
    idDocument: null as File | null,
  })

  // Available categories
  const availableCategories = ["Clothing", "Electronics", "Food", "Accessories", "Books", "Services", "Stationery"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fieldName]: e.target.files?.[0] || null }))
    }
  }

  const toggleCategory = (category: string) => {
    setFormData((prev) => {
      if (prev.categories.includes(category)) {
        return { ...prev, categories: prev.categories.filter((c) => c !== category) }
      } else {
        return { ...prev, categories: [...prev.categories, category] }
      }
    })
  }

  const handleNextStep = () => {
    setStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to register the seller
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to seller dashboard
      router.push("/seller/dashboard")
    } catch (error) {
      console.error("Error during seller onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="mb-6">You need to be logged in to complete seller onboarding.</p>
        <Button onClick={() => router.push("/auth?mode=login")}>Log In</Button>
      </div>
    )
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Seller Onboarding</h1>
            <p className="text-gray-600">Complete your profile to start selling on RUNShop</p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between">
              <div className={`flex flex-col items-center ${step >= 1 ? "text-black" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? "bg-black text-white" : "bg-gray-200"}`}
                >
                  1
                </div>
                <span className="text-sm">Business Info</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 2 ? "text-black" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? "bg-black text-white" : "bg-gray-200"}`}
                >
                  2
                </div>
                <span className="text-sm">Categories</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 3 ? "text-black" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? "bg-black text-white" : "bg-gray-200"}`}
                >
                  3
                </div>
                <span className="text-sm">Documents</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 4 ? "text-black" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 4 ? "bg-black text-white" : "bg-gray-200"}`}
                >
                  4
                </div>
                <span className="text-sm">Review</span>
              </div>
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
              <div
                className="absolute top-0 left-0 h-1 bg-black transition-all duration-300"
                style={{ width: `${(step - 1) * 33.33}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            {/* Step 1: Business Information */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Business Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <Textarea
                      id="businessDescription"
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleChange}
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button onClick={handleNextStep}>Continue</Button>
                </div>
              </div>
            )}

            {/* Step 2: Categories */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Select Product Categories</h2>
                <p className="text-gray-600 mb-4">
                  Choose the categories that best describe your products or services.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {availableCategories.map((category) => (
                    <div
                      key={category}
                      className={`border rounded-md p-3 cursor-pointer transition-colors ${
                        formData.categories.includes(category)
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                            formData.categories.includes(category) ? "border-black" : "border-gray-300"
                          }`}
                        >
                          {formData.categories.includes(category) && <CheckCircle2 className="h-4 w-4 text-black" />}
                        </div>
                        <span>{category}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button onClick={handleNextStep}>Continue</Button>
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Upload Documents</h2>
                <p className="text-gray-600 mb-4">Please upload your business logo and identification document.</p>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="logo" className="block mb-2">
                      Business Logo
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {formData.logo ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={URL.createObjectURL(formData.logo) || "/placeholder.svg"}
                            alt="Business Logo Preview"
                            className="max-h-32 mb-4"
                          />
                          <p className="text-sm text-gray-500">{formData.logo.name}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setFormData((prev) => ({ ...prev, logo: null }))}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Click or drag and drop to upload</p>
                          <p className="text-xs text-gray-400">PNG, JPG or SVG (max. 2MB)</p>
                          <input
                            id="logo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "logo")}
                          />
                          <Label htmlFor="logo">
                            <Button variant="outline" size="sm" className="mt-2" type="button">
                              Select File
                            </Button>
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="idDocument" className="block mb-2">
                      Identification Document
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {formData.idDocument ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                          <p className="text-sm text-gray-500">{formData.idDocument.name}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setFormData((prev) => ({ ...prev, idDocument: null }))}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Upload a valid ID document</p>
                          <p className="text-xs text-gray-400">PDF, PNG or JPG (max. 5MB)</p>
                          <input
                            id="idDocument"
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "idDocument")}
                          />
                          <Label htmlFor="idDocument">
                            <Button variant="outline" size="sm" className="mt-2" type="button">
                              Select File
                            </Button>
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button onClick={handleNextStep}>Continue</Button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Review Your Information</h2>
                <p className="text-gray-600 mb-6">Please review your information before submitting.</p>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Business Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Business Name</p>
                        <p>{formData.businessName || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p>{formData.phoneNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p>{formData.bankName || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Number</p>
                        <p>{formData.accountNumber || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Business Description</p>
                      <p>{formData.businessDescription || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Categories</h3>
                    {formData.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.categories.map((category) => (
                          <span key={category} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                            {category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No categories selected</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Documents</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Business Logo</p>
                        <p>{formData.logo ? formData.logo.name : "Not uploaded"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ID Document</p>
                        <p>{formData.idDocument ? formData.idDocument.name : "Not uploaded"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

