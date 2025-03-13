import type { Product, Category, WishlistItem, User, Order, Message, Seller } from "./types"

// Mock Sellers
export const sellers: Seller[] = [
  {
    id: 1,
    name: "Campus Threads",
    rating: 4.8,
    responseTime: "Usually responds within 1 hour",
  },
  {
    id: 2,
    name: "Style Hub",
    rating: 4.5,
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: 3,
    name: "Glam Accessories",
    rating: 4.7,
    responseTime: "Usually responds within 30 minutes",
  },
  {
    id: 4,
    name: "Campus Eats",
    rating: 4.9,
    responseTime: "Usually responds within 15 minutes",
  },
  {
    id: 5,
    name: "Tech Gear",
    rating: 4.6,
    responseTime: "Usually responds within 1 hour",
  },
  {
    id: 6,
    name: "Campus Supplies",
    rating: 4.4,
    responseTime: "Usually responds within 3 hours",
  },
]

// Mock Products
export const products: Product[] = [
  {
    id: 1,
    name: "T-Shirt",
    price: 9.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "clothing",
    description:
      "A comfortable and stylish T-shirt made from premium cotton. Perfect for casual wear and available in multiple colors.",
    features: ["100% Cotton", "Machine washable", "Available in multiple sizes"],
    inStock: true,
    seller: sellers[0],
  },
  {
    id: 2,
    name: "Cross Bag",
    price: 19.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "accessories",
    description:
      "A versatile cross bag that's perfect for everyday use. Features multiple compartments for organization.",
    features: ["Durable material", "Adjustable strap", "Water resistant"],
    inStock: true,
    seller: sellers[1],
  },
  {
    id: 3,
    name: "Jewellery Set",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "accessories",
    description:
      "An elegant jewelry set that includes a necklace and matching earrings. Perfect for special occasions.",
    features: ["High-quality materials", "Elegant design", "Gift box included"],
    inStock: false,
    seller: sellers[2],
  },
  {
    id: 4,
    name: "Jollof Rice",
    price: 5.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "food",
    description: "Authentic Jollof Rice ready to heat and serve. A delicious West African classic dish.",
    features: ["Ready to eat", "Authentic recipe", "Serves 2-3 people"],
    inStock: true,
    seller: sellers[3],
  },
  {
    id: 5,
    name: "Laptop Bag",
    price: 24.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "accessories",
    description:
      "A stylish and functional laptop bag with padding to protect your device. Includes multiple pockets for accessories.",
    features: ["Fits laptops up to 15.6 inches", "Padded interior", "Water-resistant exterior"],
    inStock: true,
    seller: sellers[4],
  },
  {
    id: 6,
    name: "Fried Rice",
    price: 6.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "food",
    description: "Delicious fried rice with vegetables and your choice of protein. A satisfying meal any time of day.",
    features: ["Fresh ingredients", "Customizable spice level", "Serves 1-2 people"],
    inStock: true,
    seller: sellers[3],
  },
  {
    id: 7,
    name: "Headphones",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "electronics",
    description:
      "High-quality headphones with noise cancellation and comfortable ear cups. Perfect for studying or enjoying music.",
    features: ["Noise cancellation", "Bluetooth connectivity", "20-hour battery life"],
    inStock: true,
    seller: sellers[4],
  },
  {
    id: 8,
    name: "Notebook",
    price: 3.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "stationery",
    description: "A durable notebook with high-quality paper. Perfect for taking notes in class or journaling.",
    features: ["100 pages", "Hardcover", "Acid-free paper"],
    inStock: true,
    seller: sellers[5],
  },
]

// Mock Categories
export const categories: Category[] = [
  {
    id: "clothing",
    name: "Clothing",
    image: "/placeholder.svg?height=300&width=300",
    description: "Stylish and comfortable clothing for all occasions",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/placeholder.svg?height=300&width=300",
    description: "Complete your look with our range of accessories",
  },
  {
    id: "electronics",
    name: "Electronics",
    image: "/placeholder.svg?height=300&width=300",
    description: "The latest gadgets and electronic devices",
  },
  {
    id: "food",
    name: "Food & Drinks",
    image: "/placeholder.svg?height=300&width=300",
    description: "Delicious meals and refreshing beverages",
  },
  {
    id: "stationery",
    name: "Stationery",
    image: "/placeholder.svg?height=300&width=300",
    description: "Essential supplies for your academic needs",
  },
  {
    id: "services",
    name: "Services",
    image: "/placeholder.svg?height=300&width=300",
    description: "Professional services offered by fellow students",
  },
]

// Mock Users (in a real app, this would be in a secure database)
export const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
  },
]

// Mock Wishlist Items
export const wishlistItems: WishlistItem[] = [
  {
    id: 1,
    productId: 1,
    userId: "user1",
    dateAdded: "2023-11-15",
  },
  {
    id: 2,
    productId: 3,
    userId: "user1",
    dateAdded: "2023-11-10",
  },
  {
    id: 3,
    productId: 5,
    userId: "user1",
    dateAdded: "2023-11-05",
  },
  {
    id: 4,
    productId: 2,
    userId: "user2",
    dateAdded: "2023-11-12",
  },
]

// Mock Orders
export const orders: Order[] = [
  {
    id: 1,
    userId: "user1",
    productId: 4,
    quantity: 2,
    status: "completed",
    paymentMethod: "online",
    createdAt: "2023-11-01",
  },
  {
    id: 2,
    userId: "user1",
    productId: 2,
    quantity: 1,
    status: "processing",
    paymentMethod: "delivery",
    createdAt: "2023-11-10",
  },
  {
    id: 3,
    userId: "user2",
    productId: 1,
    quantity: 3,
    status: "pending",
    paymentMethod: "online",
    createdAt: "2023-11-12",
  },
]

// Mock Messages
export const messages: Message[] = [
  {
    id: 1,
    senderId: "user1",
    receiverId: "seller1",
    content: "Is this item still available?",
    timestamp: "2023-11-10T10:30:00",
    orderId: 2,
  },
  {
    id: 2,
    senderId: "seller1",
    receiverId: "user1",
    content: "Yes, it's available. Would you like to place an order?",
    timestamp: "2023-11-10T10:35:00",
    orderId: 2,
  },
  {
    id: 3,
    senderId: "user2",
    receiverId: "seller2",
    content: "Do you offer delivery to campus?",
    timestamp: "2023-11-11T14:20:00",
  },
]

