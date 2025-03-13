export interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  description: string
  features: string[]
  inStock: boolean
  seller: Seller
}

export interface Seller {
  id: number
  name: string
  rating: number
  responseTime: string
}

export interface Category {
  id: string
  name: string
  image: string
  description: string
}

export interface WishlistItem {
  id: number
  productId: number
  userId: string
  dateAdded: string
}

export interface User {
  id: string
  name: string
  email: string
}

export interface Order {
  id: number
  userId: string
  productId: number
  quantity: number
  status: "pending" | "processing" | "completed" | "cancelled"
  paymentMethod: "online" | "delivery"
  createdAt: string
}

export interface Message {
  id: number
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  orderId?: number
}

export interface SearchFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  seller?: string
}

