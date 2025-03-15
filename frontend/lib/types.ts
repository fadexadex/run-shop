// Types for the application

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "BUYER" | "SELLER" | "ADMIN" | "CUSTOMER"
  hostelName?: string
  blockNumber?: number
  roomNo?: number
  wishlist?: string[]
  sellerCompleted?: boolean
  seller?: Seller
  shippingAddress?: string
}

export interface Category {
  id: string
  name: string
  description: string
  imageUrl?: string
}

export interface Seller {
  id: string
  userId: string
  catalogueName: string
  cataloguePicture?: string
  paymentMethod: "ONLINE" | "DELIVERY" | "BOTH"
  createdAt: string
  updatedAt: string
  products?: Product[]
}

export interface Product {
  id: string
  name: string
  description: string
  price: string
  stockQuantity: number
  imageUrls: string[]
  categoryId: string
  sellerId: string
  createdAt: string
  category?: {
    id: string
    name: string
  }
  seller?: {
    id: string
    catalogueName: string
  }
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  sellerId: string
  items: OrderItem[]
  totalPrice: number
  orderStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"
  paymentMethod: "ONLINE" | "DELIVERY"
  escrowStatus: "HELD" | "RELEASED" | "REFUNDED"
  hostelName: string
  blockNumber: number
  roomNo: number
  createdAt: string
  product?: Product
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  dateAdded: string
  product?: Product
}

export interface PaymentResponse {
  success: boolean
  checkoutUrl: string
  reference: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  orderId?: string
}

export interface ChatMessage {
  id: string
  orderId: string
  messages: Message[]
}

