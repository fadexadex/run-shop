"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ImagePlus, Loader2, Save, Trash2 } from "lucide-react"
import { mockProductsService, mockCategoriesService, mockFileUploadService } from "@/lib/mock-service"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "1",
    categoryId: "",
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useState(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await mockCategoriesService.getAllCategories()
        setCategories(response.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Create URLs for preview
      const newUrls = newFiles.map((file) => URL.createObjectURL(file))

      setImageFiles((prev) => [...prev, ...newFiles])
      setImageUrls((prev) => [...prev, ...newUrls])
    }
  }

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    } else if (Number(formData.price) < 100) {
      newErrors.price = "Price must be at least 100 Naira"
    }

    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = "Stock quantity is required"
    } else if (isNaN(Number(formData.stockQuantity)) || Number(formData.stockQuantity) <= 0) {
      newErrors.stockQuantity = "Stock quantity must be a positive number"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required"
    }

    if (imageFiles.length === 0) {
      newErrors.images = "At least one product image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !user.isSeller) {
      toast({
        title: "Error",
        description: "You must be logged in as a seller to add products",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      // Upload images
      let uploadedImageUrls: string[] = []
      if (imageFiles.length > 0) {
        const uploadResponse = await mockFileUploadService.uploadMultipleImages(imageFiles)
        uploadedImageUrls = uploadResponse.urls
      }

      // Create product
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stockQuantity: Number(formData.stockQuantity),
        categoryId: formData.categoryId,
        sellerId: user.id,
        imageUrls: uploadedImageUrls,
      }

      await mockProductsService.createProduct(productData)

      toast({
        title: "Success",
        description: "Product added successfully",
      })

      // Redirect to seller products page
      router.push("/seller/dashboard")
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/seller/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-black">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl font-bold">Add New Product</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="100"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price in Naira"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    min="1"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    className={errors.stockQuantity ? "border-red-500" : ""}
                  />
                  {errors.stockQuantity && <p className="text-sm text-red-500">{errors.stockQuantity}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.categoryId} onValueChange={(value) => handleSelectChange("categoryId", value)}>
                  <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
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
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
              </div>

              <div className="space-y-2">
                <Label>Product Images</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Click to upload product images</p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}

                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t p-6 bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/seller/dashboard")}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-black hover:bg-gray-800 text-white" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Product
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

