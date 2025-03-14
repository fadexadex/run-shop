"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Category {
  id: string
  name: string
  description: string
}

export default function CategoriesManagement() {
  const { user } = useAuth()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  })

  useEffect(() => {
    // Check if user is a seller
    if (user && user.role !== "SELLER" && !localStorage.getItem("pendingSeller")) {
      router.push("/account")
      return
    }

    fetchCategories()
  }, [user, router])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:6160/api/v1/categories/only")

      if (response.ok) {
        const data = await response.json()
        setCategories(data.data || [])
      } else {
        setError("Failed to fetch categories")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("An error occurred while fetching categories")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const openAddDialog = () => {
    setFormData({ id: "", name: "", description: "" })
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (category: Category) => {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || "",
    })
    setIsDeleteDialogOpen(true)
  }

  const handleAddCategory = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Category name is required")
      }

      const response = await fetch("http://localhost:6160/api/v1/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to add category")
      }

      await response.json()
      setSuccess("Category added successfully!")
      setIsAddDialogOpen(false)
      fetchCategories()
    } catch (error: any) {
      console.error("Error adding category:", error)
      setError(error.message || "Failed to add category. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCategory = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Category name is required")
      }

      const response = await fetch(`http://localhost:6160/api/v1/categories/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to update category")
      }

      await response.json()
      setSuccess("Category updated successfully!")
      setIsEditDialogOpen(false)
      fetchCategories()
    } catch (error: any) {
      console.error("Error updating category:", error)
      setError(error.message || "Failed to update category. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      const response = await fetch(`http://localhost:6160/api/v1/categories/${formData.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to delete category")
      }

      setSuccess("Category deleted successfully!")
      setIsDeleteDialogOpen(false)
      fetchCategories()
    } catch (error: any) {
      console.error("Error deleting category:", error)
      setError(error.message || "Failed to delete category. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="mb-6">You need to be logged in as a seller to manage categories.</p>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Link
              href="/seller/dashboard"
              className="inline-flex items-center text-sm text-gray-600 hover:text-[#008ECC]"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
            <Button onClick={openAddDialog} className="bg-[#008ECC] hover:bg-[#007bb3] text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Category
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Category Management</h1>

            <FormError message={error} />
            <FormSuccess message={success} />

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#008ECC]" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">No categories found</p>
                <Button onClick={openAddDialog} className="bg-[#008ECC] hover:bg-[#007bb3] text-white">
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Category
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium">{category.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {category.description ? (
                            <span>{category.description}</span>
                          ) : (
                            <span className="text-gray-400 italic">No description</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(category)}
                              className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(category)}
                              className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Electronics, Clothing, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this category..."
                rows={3}
              />
            </div>
          </div>
          <FormError message={error} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              className="bg-[#008ECC] hover:bg-[#007bb3] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Electronics, Clothing, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this category..."
                rows={3}
              />
            </div>
          </div>
          <FormError message={error} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleEditCategory}
              className="bg-[#008ECC] hover:bg-[#007bb3] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete the category <span className="font-semibold">{formData.name}</span>?
            </p>
            <p className="text-red-500 text-sm mt-2">
              This action cannot be undone and will also remove all products associated with this category.
            </p>
          </div>
          <FormError message={error} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleDeleteCategory} variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

