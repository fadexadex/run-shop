// Base API URL
const API_BASE_URL = "http://localhost:6160/api/v1"

// Helper function for making API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Something went wrong")
  }

  return response.json()
}

// Auth API
export const authApi = {
  // Example implementation - update this to match your actual implementation
  async getProfile() {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No token found")
    }

    const response = await fetch("http://localhost:6160/api/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch profile")
    }

    return await response.json()
    // The response will have a data property that contains the user object
    // The auth context will handle extracting the user from userData.data
  },

  // Other methods...
  async login(email, password) {
    // Implementation
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    return data
  },

  async register(userData) {
    // Implementation
    // Log the registration data to help with debugging
    console.log("Registration data:", userData)

    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
    return data
  },

  async updateProfile(userData) {
    // Implementation
    const data = await apiRequest("/users/update", {
      method: "PUT",
      body: JSON.stringify(userData),
    })
    return data
  },
}

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const data = await apiRequest("/categories/all")
    return data
  },

  getCategoryOnly: async () => {
    const data = await apiRequest("/categories/only")
    return data
  },

  getCategoryProducts: async (categoryId: string) => {
    const data = await apiRequest(`/categories/${categoryId}`)
    return data
  },

  addCategory: async (categoryData: { name: string; description?: string }) => {
    const data = await apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    })
    return data
  },

  updateCategory: async (categoryId: string, categoryData: { name: string; description?: string }) => {
    const data = await apiRequest(`/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    })
    return data
  },

  deleteCategory: async (categoryId: string) => {
    const data = await apiRequest(`/categories/${categoryId}`, {
      method: "DELETE",
    })
    return data
  },
}

// Products API
export const productsApi = {
  getAll: async (
    params: {
      page?: number
      limit?: number
      filters?: Record<string, any>
    } = {},
  ) => {
    const { page = 1, limit = 10, filters = {} } = params
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (Object.keys(filters).length > 0) {
      queryParams.append("filters", JSON.stringify(filters))
    }

    const data = await apiRequest(`/products/all?${queryParams.toString()}`)
    return data
  },

  getById: async (productId: string) => {
    const data = await apiRequest(`/products/${productId}`)
    return data
  },
}

// Wishlist API
export const wishlistApi = {
  getWishlist: async () => {
    const data = await apiRequest("/wishlist")
    return data
  },

  addToWishlist: async (productId: string) => {
    const data = await apiRequest("/wishlist/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
    })
    return data
  },

  removeFromWishlist: async (productId: string) => {
    const data = await apiRequest(`/wishlist/remove/${productId}`, {
      method: "DELETE",
    })
    return data
  },
}

// Orders API
export const ordersApi = {
  getOrders: async () => {
    const data = await apiRequest("/orders")
    return data
  },

  createOrder: async (orderData: {
    productId: string
    quantity: number
    paymentMethod: "ONLINE" | "DELIVERY"
  }) => {
    const data = await apiRequest("/orders/create", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
    return data
  },
}

// Seller API
export const sellerApi = {
  getProfile: async () => {
    const data = await apiRequest("/sellers/profile")
    return data
  },

  updateProfile: async (formData: FormData) => {
    // For FormData, we need to handle it differently since it's not JSON
    const token = localStorage.getItem("token")

    const headers: HeadersInit = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/sellers/update`, {
      method: "PUT",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Something went wrong")
    }

    return response.json()
  },

  registerSeller: async (formData: FormData) => {
    // For FormData, we need to handle it differently since it's not JSON
    const token = localStorage.getItem("token")

    const headers: HeadersInit = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/sellers/register`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Something went wrong")
    }

    return response.json()
  },
}

// Products API for sellers
export const sellerProductsApi = {
  getProducts: async (sellerId: string) => {
    const data = await apiRequest(`/sellers/${sellerId}/products`)
    return data
  },

  addProduct: async (sellerId: string, formData: FormData) => {
    // For FormData, we need to handle it differently since it's not JSON
    const token = localStorage.getItem("token")

    const headers: HeadersInit = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/catalogue`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to add product")
    }

    return response.json()
  },

  updateProduct: async (productId: string, formData: FormData) => {
    const token = localStorage.getItem("token")

    const headers: HeadersInit = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "PUT",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to update product")
    }

    return response.json()
  },

  deleteProduct: async (productId: string) => {
    const data = await apiRequest(`/products/${productId}`, {
      method: "DELETE",
    })
    return data
  },
}

