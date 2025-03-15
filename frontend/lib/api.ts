// Base API URL - only used for payments
const API_BASE_URL = "http://localhost:6160/api/v1"

// Helper function for simulating API delays
async function simulateDelay(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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

// Categories API with mock data
export const categoriesApi = {
  getAll: async () => {
    await simulateDelay()
    const { categories, products } = await import("./db")

    const categoriesWithProducts = categories.map((category) => {
      const categoryProducts = products.filter((product) => product.category === category.id)
      return {
        ...category,
        products: categoryProducts,
      }
    })

    return { data: categoriesWithProducts }
  },

  getCategoryOnly: async () => {
    await simulateDelay()
    const { categories } = await import("./db")
    return { data: categories }
  },

  getCategoryProducts: async (categoryId: string) => {
    await simulateDelay()
    const { products } = await import("./db")
    const categoryProducts = products.filter((product) => product.category === categoryId)
    return { data: categoryProducts }
  },

  addCategory: async (categoryData: { name: string; description?: string }) => {
    await simulateDelay()
    return { success: true, data: { id: `new-${Date.now()}`, ...categoryData } }
  },

  updateCategory: async (categoryId: string, categoryData: { name: string; description?: string }) => {
    await simulateDelay()
    return { success: true, data: { id: categoryId, ...categoryData } }
  },

  deleteCategory: async (categoryId: string) => {
    await simulateDelay()
    return { success: true }
  },
}

// Products API with mock data
export const productsApi = {
  getAll: async (
    params: {
      page?: number
      limit?: number
      filters?: Record<string, any>
    } = {},
  ) => {
    await simulateDelay()
    const { products } = await import("./db")

    const { page = 1, limit = 10 } = params
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedProducts = products.slice(startIndex, endIndex)

    return {
      data: {
        products: paginatedProducts,
        pagination: {
          total: products.length,
          page,
          limit,
          pages: Math.ceil(products.length / limit),
        },
      },
    }
  },

  getById: async (productId: string) => {
    await simulateDelay()
    const { products } = await import("./db")
    const product = products.find((p) => p.id.toString() === productId)

    if (!product) {
      throw new Error("Product not found")
    }

    return { data: product }
  },
}

// Wishlist API with mock data
export const wishlistApi = {
  getWishlist: async () => {
    await simulateDelay()
    // Mock wishlist items
    const wishlistItems = [1, 3, 5].map((id) => ({ productId: id.toString() }))
    return { data: wishlistItems }
  },

  addToWishlist: async (productId: string) => {
    await simulateDelay()
    return { success: true, data: { productId } }
  },

  removeFromWishlist: async (productId: string) => {
    await simulateDelay()
    return { success: true }
  },
}

// Orders API with mock data
export const ordersApi = {
  getOrders: async () => {
    await simulateDelay()
    const { orders } = await import("./db")
    return { data: orders }
  },

  createOrder: async (orderData: {
    productId: string
    quantity: number
    paymentMethod: "ONLINE" | "DELIVERY"
  }) => {
    await simulateDelay()

    // Keep the real payment API call if payment method is ONLINE
    if (orderData.paymentMethod === "ONLINE") {
      try {
        const response = await fetch(`${API_BASE_URL}/payments/initiate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 1000, // Example amount
            orderId: `order-${Date.now()}`,
            ...orderData,
          }),
        })

        if (!response.ok) {
          throw new Error("Payment initiation failed")
        }

        return await response.json()
      } catch (error) {
        console.error("Payment error:", error)
        throw error
      }
    }

    // Mock response for non-payment orders
    return {
      success: true,
      data: {
        id: `order-${Date.now()}`,
        ...orderData,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    }
  },
}

// Seller API
export const sellerApi = {
  getProfile: async () => {
    await simulateDelay()
    return { data: { name: "Mock Seller", id: "seller-1" } }
  },

  updateProfile: async (formData: FormData) => {
    await simulateDelay()
    return { success: true, data: { message: "Profile updated successfully" } }
  },

  registerSeller: async (formData: FormData) => {
    await simulateDelay()
    return { success: true, data: { message: "Seller registered successfully" } }
  },
}

// Products API for sellers
export const sellerProductsApi = {
  getProducts: async (sellerId: string) => {
    await simulateDelay()
    const mockProducts = [
      { id: "prod-1", name: "Mock Product 1", sellerId },
      { id: "prod-2", name: "Mock Product 2", sellerId },
    ]
    return { data: mockProducts }
  },

  addProduct: async (sellerId: string, formData: FormData) => {
    await simulateDelay()
    return { success: true, data: { message: "Product added successfully" } }
  },

  updateProduct: async (productId: string, formData: FormData) => {
    await simulateDelay()
    return { success: true, data: { message: "Product updated successfully" } }
  },

  deleteProduct: async (productId: string) => {
    await simulateDelay()
    return { success: true }
  },
}

