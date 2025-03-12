"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth/auth-context"
import { sellerAPI, categoryAPI } from "@/lib/api"
import { useRouter } from "next/navigation"
import { X, ImageIcon } from "lucide-react"

export default function AddProductForm() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
  })

  // Fetch categories on component mount
  useState(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryAPI.getAllCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load categories. Please try again.")
      }
    }

    fetchCategories()
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      // Create preview URLs for the selected files
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))

      setSelectedFiles((prev) => [...prev, ...filesArray])
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removeFile = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index])

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.sellerId) {
      setError("Seller account required to add products")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate form data
      if (
        !formData.name ||
        !formData.description ||
        !formData.price ||
        !formData.stockQuantity ||
        !formData.categoryId
      ) {
        throw new Error("Please fill in all required fields")
      }

      if (selectedFiles.length === 0) {
        throw new Error("Please upload at least one product image")
      }

      // Create FormData object for the API request
      const productFormData = new FormData()
      productFormData.append("name", formData.name)
      productFormData.append("description", formData.description)
      productFormData.append("price", formData.price)
      productFormData.append("stockQuantity", formData.stockQuantity)
      productFormData.append("categoryId", formData.categoryId)

      // Append all selected files
      selectedFiles.forEach((file) => {
        productFormData.append("files", file)
      })

      // Send the request to add the product
      const response = await sellerAPI.addProductToCatalogue(user.sellerId, productFormData)

      setSuccess("Product added successfully!")

      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        categoryId: "",
      })

      // Clear file previews
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
      setSelectedFiles([])
      setPreviewUrls([])

      // Redirect to the seller's products page after a delay
      setTimeout(() => {
        router.push("/seller/products")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">{error}</div>}

      {success && <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Wireless Bluetooth Speaker"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your product in detail..."
            rows={4}
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (USD) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g. 49.99"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Stock Quantity *</Label>
            <Input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="1"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              placeholder="e.g. 100"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            required
            disabled={isLoading}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Product Images *</Label>

          {/* Image preview area */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-md overflow-hidden border">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* File input */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            <div className="flex flex-col items-center">
              <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Drag and drop product images here, or click to browse</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-black text-white" disabled={isLoading}>
          {isLoading ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </div>
  )
}

