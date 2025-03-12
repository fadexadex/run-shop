// Base API configuration
const API_BASE_URL = "http://localhost:6160/api/v1"

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("runshop_token")
  }
  return null
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json()

  if (!response.ok) {
    // Handle token expiration
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("runshop_token")
        window.location.href = "/"
      }
    }

    // Throw error with message from the API
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    return handleResponse(response)
  },

  register: async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    shippingAddress?: string
    role: "CUSTOMER" | "SELLER"
    catalogueName?: string
    paymentMethod?: "ONLINE" | "CASH"
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    return handleResponse(response)
  },

  getCurrentUser: async () => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },
}

// User API
export const userAPI = {
  updateProfile: async (
    userId: string,
    userData: {
      firstName?: string
      lastName?: string
      shippingAddress?: string
    },
  ) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })

    return handleResponse(response)
  },

  getWishlist: async () => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/users/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },

  addToWishlist: async (productId: string) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/users/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    })

    return handleResponse(response)
  },

  removeFromWishlist: async (productId: string) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/users/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },
}

// Product API
export const productAPI = {
  getAllProducts: async (params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
  }) => {
    // Build query string from params
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
    const response = await fetch(`${API_BASE_URL}/products${queryString}`)

    return handleResponse(response)
  },

  getProductById: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`)
    return handleResponse(response)
  },

  getProductsByCategory: async (categoryId: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/products`)
    return handleResponse(response)
  },
}

// Seller API
export const sellerAPI = {
  getSellerProfile: async (sellerId: string) => {
    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}`)
    return handleResponse(response)
  },

  addProductToCatalogue: async (sellerId: string, productData: FormData) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/catalogue`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData, browser will set it with boundary
      },
      body: productData,
    })

    return handleResponse(response)
  },

  getSellerProducts: async (sellerId: string) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/catalogue`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },

  updateProduct: async (sellerId: string, productId: string, productData: FormData) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/catalogue/${productId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData, browser will set it with boundary
      },
      body: productData,
    })

    return handleResponse(response)
  },

  deleteProduct: async (sellerId: string, productId: string) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/catalogue/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },
}

// Category API
export const categoryAPI = {
  getAllCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`)
    return handleResponse(response)
  },

  getCategoryById: async (categoryId: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`)
    return handleResponse(response)
  },
}

// Chat API
export const chatAPI = {
  getChats: async () => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/users/chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },

  getChatById: async (chatId: string) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },

  createChat: async (sellerId: string, initialMessage: string) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sellerId, initialMessage }),
    })

    return handleResponse(response)
  },

  sendMessage: async (chatId: string, content: string) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    })

    return handleResponse(response)
  },

  getMessages: async (chatId: string) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },
}

// Order API
export const orderAPI = {
  createOrder: async (orderData: {
    sellerId: string
    items: Array<{ productId: string; quantity: number }>
    paymentMethod: "ONLINE" | "CASH"
  }) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    })

    return handleResponse(response)
  },

  getUserOrders: async () => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/users/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },

  getOrderById: async (orderId: string) => {
    const token = getAuthToken()
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },
}

