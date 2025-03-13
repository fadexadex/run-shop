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
  login: async (email: string, password: string) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    return data
  },

  register: async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    shippingAddress: string
  }) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
    return data
  },

  getProfile: async () => {
    const data = await apiRequest("/auth/me")
    return data
  },

  updateProfile: async (userData: {
    firstName?: string
    lastName?: string
    shippingAddress?: string
  }) => {
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

  getCategoryProducts: async (categoryId: string) => {
    const data = await apiRequest(`/categories/${categoryId}`)
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

// Wishlist API (assuming these endpoints exist based on the structure)
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

// Orders API (assuming these endpoints exist based on the structure)
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

