"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, Upload, AlertCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { categoriesApi } from "@/lib/api"

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  sellerId: string
  name: string
  description: string
  price: string
  stockQuantity: number
  categoryId: string
  imageUrls: string[]
  category?: {
    name: string
  }
  seller?: {
    id: string
    catalogueName: string
  }
}

export default function EditProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return

    const fetchProductAndCategories = async () => {
      try {
        setLoading(true)

        // Get token
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        // Fetch product details
        const productResponse = await fetch(`http://localhost:6160/api/v1/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!productResponse.ok) {
          throw new Error("Failed to fetch product details")
        }

        const productData = await productResponse.json()

        if (!productData.data) {
          throw new Error("Product not found")
        }

        setProduct(productData.data)

        // Set form values
        setName(productData.data.name)
        setDescription(productData.data.description)
        setPrice(productData.data.price)
        setStockQuantity(productData.data.stockQuantity.toString())
        setCategoryId(productData.data.categoryId)
        setImageUrls(productData.data.imageUrls || [])

        // Fetch categories
        const categoriesResponse = await categoriesApi.getCategoryOnly()
        setCategories(categoriesResponse.data || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error instanceof Error ? error.message : "Failed to load product data")
      } finally {
        setLoading(false)
      }
    }

    fetchProductAndCategories()
  }, [user, productId])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const handleRemoveSelectedImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingImage = (url: string) => {
    setImageUrls((prev) => prev.filter((imgUrl) => imgUrl !== url))
    setImagesToRemove((prev) => [...prev, url])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!product) return

    try {
      setSubmitting(true)
      setError(null)
      setSuccess(null)

      // Validate form
      if (!name || !description || !price || !stockQuantity || !categoryId) {
        throw new Error("Please fill in all required fields")
      }

      if (imageUrls.length === 0 && images.length === 0) {
        throw new Error("Please add at least one product image")
      }

      // Create FormData
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("stockQuantity", stockQuantity)
      formData.append("categoryId", categoryId)

      // Add existing images that weren't removed
      formData.append("existingImages", JSON.stringify(imageUrls))

      // Add new images
      images.forEach((image) => {
        formData.append("files", image)
      })

      // Get token
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Update product
      const response = await fetch(`http://localhost:6160/api/v1/sellers/${product.id}/catalogue`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to update product")
      }

      const data = await response.json()
      setSuccess("Product updated successfully!")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/seller/dashboard?tab=products")
      }, 1500)
    } catch (error) {
      console.error("Error updating product:", error)
      setError(error instanceof Error ? error.message : "Failed to update product")
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="mb-6">You need to be logged in as a seller to edit products.</p>
        <Button
          onClick={() => router.push("/auth/seller?mode=login")}
          className="bg-[#008ECC] hover:bg-[#007bb3] text-white"
        >
          Log In as Seller
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#008ECC]" />
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="mb-6 text-red-500">{error}</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-gray-500 mt-2">Update your product information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">{success}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product"
                  rows={5}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <Label>Product Images *</Label>
                <p className="text-sm text-gray-500 mb-2">
                  Upload clear images of your product. You can upload multiple images.
                </p>

                {/* Existing images */}
                {imageUrls.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Current Images:</p>
                    <div className="flex flex-wrap gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Product image ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(url)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New images */}
                {images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">New Images to Add:</p>
                    <div className="flex flex-wrap gap-4">
                      {images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`New product image ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-dashed"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Add More Images
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/seller/dashboard?tab=products")}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#008ECC] hover:bg-[#007bb3] text-white" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitting ? "Updating..." : "Update Product"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  )
}

