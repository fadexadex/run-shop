"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Upload, X, Plus, Loader2 } from "lucide-react"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"

interface Category {
  id: string
  name: string
}

export default function AddProduct() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "1",
    categoryId: "",
  })

  const [productImages, setProductImages] = useState<File[]>([])
  //const [sellerId, setSellerId] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is a seller
    if (user && user.role !== "SELLER" && !localStorage.getItem("pendingSeller")) {
      router.push("/account")
      return
    }

    // Fetch categories
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await fetch("http://localhost:6160/api/v1/categories/only")

        if (response.ok) {
          const data = await response.json()
          setCategories(data.data || [])
        } else {
          console.error("Failed to fetch categories")
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
    //fetchSellerProfile()
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to array and add to existing images
      const newFiles = Array.from(e.target.files)
      setProductImages((prev) => [...prev, ...newFiles])

      // Reset the input value so the same file can be selected again if needed
      e.target.value = ""
    }
  }

  const removeImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!user?.seller?.id) {
        throw new Error("Seller ID not found. Please complete your seller profile first.")
      }

      // Validate form
      if (!formData.name.trim()) throw new Error("Product name is required")
      if (!formData.description.trim()) throw new Error("Product description is required")
      if (!formData.price.trim() || isNaN(Number(formData.price))) throw new Error("Valid price is required")
      if (!formData.stockQuantity.trim() || isNaN(Number(formData.stockQuantity)))
        throw new Error("Valid stock quantity is required")
      if (!formData.categoryId) throw new Error("Category is required")
      if (productImages.length === 0) throw new Error("At least one product image is required")

      // Create form data for file upload
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("price", formData.price)
      formDataToSend.append("stockQuantity", formData.stockQuantity)
      formDataToSend.append("categoryId", formData.categoryId)

      // Append all images with the correct field name "files"
      productImages.forEach((image) => {
        formDataToSend.append("files", image)
      })

      // Get the token from localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      // Make API call to add product to catalogue
      const response = await fetch(`http://localhost:6160/api/v1/sellers/${user.seller.id}/catalogue`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to add product to catalogue")
      }

      const data = await response.json()
      setSuccess("Product added successfully!")

      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        stockQuantity: "1",
        categoryId: "",
      })
      setProductImages([])

      // Redirect to products page after a short delay
      setTimeout(() => {
        router.push("/seller/dashboard?tab=products")
      }, 2000)
    } catch (error: any) {
      console.error("Error adding product:", error)
      setError(error.message || "Failed to add product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="mb-6">You need to be logged in as a seller to add products.</p>
        <Button
          onClick={() => router.push("/auth/seller?mode=login")}
          className="bg-[#008ECC] hover:bg-[#007bb3] text-white"
        >
          Log In as Seller
        </Button>
      </div>
    )
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href="/seller/dashboard"
              className="inline-flex items-center text-sm text-gray-600 hover:text-[#008ECC]"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

            <FormError message={error} />
            <FormSuccess message={success} />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="e.g. Wireless Bluetooth Headphones"
                />
              </div>

              <div>
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Describe your product in detail..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="e.g. 49.99"
                  />
                </div>

                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                {loadingCategories ? (
                  <div className="flex items-center mt-1 h-10">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Loading categories...</span>
                  </div>
                ) : (
                  <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <Label className="block mb-2">Product Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {productImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {/* Add image button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:text-[#008ECC] hover:border-[#008ECC]"
                    >
                      <Plus className="h-6 w-6 mb-1" />
                      <span className="text-xs">Add Image</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Upload product images (max 5 images)</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-[#008ECC] text-[#008ECC] hover:bg-[#008ECC]/5"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Images
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => router.push("/seller/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#008ECC] hover:bg-[#007bb3] text-white" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Product...
                    </>
                  ) : (
                    "Add Product"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

