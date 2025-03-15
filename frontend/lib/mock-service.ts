// Mock delay to simulate network latency (ms)
const API_DELAY = 800

// Helper function to simulate API delay
const simulateApiDelay = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Helper to create a slug from a product name
export const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock Categories
const categories = [
  { id: 'cat1', name: 'Electronics', description: 'Electronic devices and gadgets', imageUrl: '/placeholder.svg?height=200&width=200' },
  { id: 'cat2', name: 'Fashion', description: 'Clothing, shoes, and accessories', imageUrl: '/placeholder.svg?height=200&width=200' },
  { id: 'cat3', name: 'Home & Kitchen', description: 'Furniture, appliances, and kitchenware', imageUrl: '/placeholder.svg?height=200&width=200' },
  { id: 'cat4', name: 'Books', description: 'Books, textbooks, and study materials', imageUrl: '/placeholder.svg?height=200&width=200' },
  { id: 'cat5', name: 'Sports', description: 'Sports equipment and fitness gear', imageUrl: '/placeholder.svg?height=200&width=200' },
  { id: 'cat6', name: 'Beauty', description: 'Cosmetics, skincare, and personal care', imageUrl: '/placeholder.svg?height=200&width=200' },
];

// Mock Sellers
const sellers: Seller[] = [
  {
    id: 'seller1',
    email: 'techstore@example.com',
    password: 'password123',
    catalogueName: 'Tech Store',
    phoneNumber: '08012345678',
    address: 'Block 5, University of Lagos',
    bio: 'We sell the latest tech gadgets at affordable prices',
    rating: 4.8,
    totalSales: 156,
    joinedDate: '2023-01-15',
    verified: true,
    imageUrl: '/placeholder.svg?height=100&width=100',
  },
  {
    id: 'seller2',
    email: 'fashionhub@example.com',
    password: 'password123',
    catalogueName: 'Fashion Hub',
    phoneNumber: '08023456789',
    address: 'Block 2, University of Lagos',
    bio: 'Your one-stop shop for trendy fashion items',
    rating: 4.5,
    totalSales: 98,
    joinedDate: '2023-03-22',
    verified: true,
    imageUrl: '/placeholder.svg?height=100&width=100',
  },
  {
    id: 'seller3',
    email: 'bookworm@example.com',
    password: 'password123',
    catalogueName: 'BookWorm',
    phoneNumber: '08034567890',
    address: 'Block 8, University of Lagos',
    bio: 'We sell textbooks, novels, and study materials',
    rating: 4.7,
    totalSales: 120,
    joinedDate: '2023-02-10',
    verified: true,
    imageUrl: '/placeholder.svg?height=100&width=100',
  },
];

// Mock Products
const products = [
  {
    id: 'prod1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 40-hour battery life.',
    price: '15000.00',
    stockQuantity: 25,
    imageUrls: [
      '/placeholder.svg?height=300&width=300&text=Headphones+Front',
      '/placeholder.svg?height=300&width=300&text=Headphones+Side',
      '/placeholder.svg?height=300&width=300&text=Headphones+Back',
    ],
    categoryId: 'cat1',
    sellerId: 'seller1',
    rating: 4.7,
    reviewCount: 42,
    dateAdded: '2024-02-15',
    featured: true,
    category: { id: 'cat1', name: 'Electronics' },
    seller: sellers[0],
  },
  {
    id: 'prod2',
    name: 'Stylish Denim Jacket',
    description: 'Classic denim jacket with a modern twist. Perfect for casual outings.',
    price: '8500.00',
    stockQuantity: 15,
    imageUrls: [
      '/placeholder.svg?height=300&width=300&text=Jacket+Front',
      '/placeholder.svg?height=300&width=300&text=Jacket+Back',
    ],
    categoryId: 'cat2',
    sellerId: 'seller2',
    rating: 4.5,
    reviewCount: 28,
    dateAdded: '2024-02-20',
    featured: false,
    category: { id: 'cat2', name: 'Fashion' },
    seller: sellers[1],
  },
  {
    id: 'prod3',
    name: 'Introduction to Computer Science Textbook',
    description: 'Comprehensive textbook covering the fundamentals of computer science.',
    price: '5000.00',
    stockQuantity: 30,
    imageUrls: [
      '/placeholder.svg?height=300&width=300&text=Textbook+Cover',
      '/placeholder.svg?height=300&width=300&text=Textbook+Back',
    ],
    categoryId: 'cat4',
    sellerId: 'seller3',
    rating: 4.8,
    reviewCount: 35,
    dateAdded: '2024-02-10',
    featured: true,
    category: { id: 'cat4', name: 'Books' },
    seller: sellers[2],
  },
  {
    id: 'prod4',
    name: 'Smart Watch',
    description: 'Feature-packed smartwatch with health monitoring and notifications.',
    price: '25000.00',
    stockQuantity: 10,
    imageUrls: [
      '/placeholder.svg?height=300&width=300&text=Watch+Front',
      '/placeholder.svg?height=300&width=300&text=Watch+Side',
    ],
    categoryId: 'cat1',
    sellerId: 'seller1',
    rating: 4.6,
    reviewCount: 19,
    dateAdded: '2024-02-25',
    featured: true,
    category: { id: 'cat1', name: 'Electronics' },
    seller: sellers[0],
  },
  {
    id: 'prod5',
    name: 'Running Shoes',
    description: 'Lightweight and comfortable running shoes for all terrains.',
    price: '12000.00',
    stockQuantity: 20,
    imageUrls: [
      '/placeholder.svg?height=300&width=300&text=Shoes+Side',
      '/placeholder.svg?height=300&width=300&text=Shoes+Top',
      '/placeholder.svg?height=300&width=300&text=Shoes+Bottom',
    ],
    categoryId: 'cat5',
    sellerId: 'seller2',
    rating: 4.4,
    reviewCount: 22,
    dateAdded: '2024-02-18',
    featured: false,
    category: { id: 'cat5', name: 'Sports' },
    seller: sellers[1],
  },
  {
    id: 'prod6',
    name: 'Skincare Set',
    description: 'Complete skincare routine with cleanser, toner, and moisturizer.',
    price: '9500.00',
    stockQuantity: 15,
    imageUrls: [
      '/placeholder.svg?height=300&width=300&text=Skincare+Set',
      '/placeholder.svg?height=300&width=300&text=Individual+Products',
    ],
    categoryId: 'cat6',
    sellerId: 'seller2',
    rating: 4.9,
    reviewCount: 31,
    dateAdded: '2024-02-12',
    featured: true,
    category: { id: 'cat6', name: 'Beauty' },
    seller: sellers[1],
  },
  {
    id: 'prod7',
    name: 'Portable Bluetooth Speaker',
    description: 'Compact speaker with powerful sound and waterproof design.',
    price: '7500.00',
    stockQuantity: 18,
    imageUrls: [
      '/placeholder.svg?height=300&width=300&text=Speaker+Front',
      '/placeholder.svg?height=300&width=300&text=Speaker+Back',
    ],
    categoryId: 'cat1',
    sellerId: 'seller1',
    rating: 4.5,
    reviewCount: 27,
    dateAdded: '2024-02-22',
    featured: false,
    category: { id: 'cat1', name: 'Electronics' },
    seller: sellers[0],
  },
  {
    id: 'prod8',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe.',
    price: '18000.00',
    stockQuantity: 8,
    imageUrls: [
      '/placeholder.svg?height=300&width=300&text=Coffee+Maker+Front',
      '/placeholder.svg?height=300&width=300&text=Coffee+Maker+Side',
    ],
    categoryId: 'cat3',
    sellerId: 'seller1',
    rating: 4.7,
    reviewCount: 15,
    dateAdded: '2024-02-28',
    featured: true,
    category: { id: 'cat3', name: 'Home & Kitchen' },
    seller: sellers[0],
  },
];

// Mock Users
const users: User[] = [
  {
    id: 'user1',
    email: 'john@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '08045678901',
    hostelName: 'Prophet Moses',
    blockNumber: 10,
    roomNo: 7,
    joinedDate: '2023-05-10',
    imageUrl: '/placeholder.svg?height=100&width=100',
  },
  {
    id: 'user2',
    email: 'jane@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    phoneNumber: '08056789012',
    hostelName: 'Prophet Elijah',
    blockNumber: 5,
    roomNo: 12,
    joinedDate: '2023-06-15',
    imageUrl: '/placeholder.svg?height=100&width=100',
  },
];

// Mock Wishlist
let wishlistItems: { id: string; userId: string; productId: string; dateAdded: string }[] = [
  {
    id: 'wish1',
    userId: 'user1',
    productId: 'prod1',
    dateAdded: '2024-02-20',
  },
  {
    id: 'wish2',
    userId: 'user1',
    productId: 'prod3',
    dateAdded: '2024-02-22',
  },
  {
    id: 'wish3',
    userId: 'user2',
    productId: 'prod2',
    dateAdded: '2024-02-25',
  },
];

// Mock Orders
let orders: any[] = [
  {
    id: 'order1',
    userId: 'user1',
    sellerId: 'seller1',
    totalPrice: 15000,
    orderStatus: 'DELIVERED',
    paymentMethod: 'ONLINE',
    escrowStatus: 'RELEASED',
    items: [
      {
        productId: 'prod1',
        quantity: 1,
        price: 15000,
      },
    ],
    hostelName: 'Prophet Moses',
    blockNumber: 10,
    roomNo: 7,
    createdAt: '2024-02-15',
    updatedAt: '2024-02-18',
  },
  {
    id: 'order2',
    userId: 'user2',
    sellerId: 'seller2',
    totalPrice: 8500,
    orderStatus: 'PENDING',
    paymentMethod: 'DELIVERY',
    escrowStatus: 'HELD',
    items: [
      {
        productId: 'prod2',
        quantity: 1,
        price: 8500,
      },
    ],
    hostelName: 'Prophet Elijah',
    blockNumber: 5,
    roomNo: 12,
    createdAt: '2024-02-25',
    updatedAt: '2024-02-25',
  },
];

// Mock Messages
let messages: any[] = [
  {
    id: 'msg1',
    orderId: 'order2',
    senderId: 'user2',
    receiverId: 'seller2',
    content: 'Hi, I just placed an order for the denim jacket. When can I expect delivery?',
    timestamp: '2024-02-25T10:30:00',
    read: true,
  },
  {
    id: 'msg2',
    orderId: 'order2',
    senderId: 'seller2',
    receiverId: 'user2',
    content: 'Hello! Thanks for your order. I can deliver it tomorrow afternoon. Is that okay?',
    timestamp: '2024-02-25T10:45:00',
    read: true,
  },
  {
    id: 'msg3',
    orderId: 'order2',
    senderId: 'user2',
    receiverId: 'seller2',
    content: 'That works perfectly. Thank you!',
    timestamp: '2024-02-25T11:00:00',
    read: false,
  },
];

// Mock service functions to replace API calls

const productsData = products;
const categoriesData = categories;
const sellersData = sellers;
const wishlistItemsData = wishlistItems;
const ordersData = orders;
const messagesData = messages;

// Helper function to create a slug from a string
export const createSlug2 = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Products service
export const mockProductsService = {
  // Get all products
  getAllProducts: async () => {
    await delay(800);
    return productsData;
  },
  
  // Get product by ID
  getProductById: async (id: number | string) => {
    await delay(600);
    const productId = typeof id === 'string' ? parseInt(id) : id;
    return productsData.find(product => product.id === productId);
  },
  
  // Get product by slug
  getProductBySlug: async (slug: string) => {
    await delay(700);
    const product = productsData.find(product => createSlug2(product.name) === slug);
    
    if (!product) return null;
    
    // Add stockQuantity if it doesn't exist
    if (!product.stockQuantity) {
      product.stockQuantity = Math.floor(Math.random() * 50) + 10; // Random stock between 10-60
    }
    
    return product;
  },
  
  // Get products by category
  getProductsByCategory: async (categoryId: string) => {
    await delay(800);
    return productsData.filter(product => product.category === categoryId);
  },
  
  // Get related products
  getRelatedProducts: async (productId: number | string) => {
    await delay(700);
    const id = typeof productId === 'string' ? parseInt(productId) : productId;
    const product = productsData.find(p => p.id === id);
    
    if (!product) return [];
    
    // Get products in the same category
    return productsData
      .filter(p => p.category === product.category && p.id !== id)
      .slice(0, 4);
  },
  
  // Search products
  searchProducts: async (query: string, filters: any = {}) => {
    await delay(900);
    let filteredProducts = [...productsData];
    
    // Filter by search query
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by category
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === filters.category
      );
    }
    
    // Filter by price range
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= filters.minPrice
      );
    }
    
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= filters.maxPrice
      );
    }
    
    return filteredProducts;
  },
  
  // Add a new product (for sellers)
  addProduct: async (productData: any) => {
    await delay(1000);
    const newProduct = {
      id: productsData.length + 1,
      ...productData,
      inStock: true,
      stockQuantity: productData.stockQuantity || 20
    };
    
    productsData.push(newProduct);
    return newProduct;
  },
  
  // Update a product (for sellers)
  updateProduct: async (id: number | string, productData: any) => {
    await delay(800);
    const productId = typeof id === 'string' ? parseInt(id) : id;
    const index = productsData.findIndex(product => product.id === productId);
    
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    productsData[index] = { ...productsData[index], ...productData };
    return productsData[index];
  }
};

// Categories service
export const mockCategoriesService = {
  // Get all categories
  getAllCategories: async () => {
    await delay(600);
    return categoriesData;
  },
  
  // Get category by ID
  getCategoryById: async (id: string) => {
    await delay(500);
    return categoriesData.find(category => category.id === id);
  },
  
  // Get products by category
  getProductsByCategory: async (categoryId: string) => {
    await delay(800);
    return productsData.filter(product => product.category === categoryId);
  }
};

// Wishlist service
export const mockWishlistService = {
  getUserWishlist: async (userId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get wishlist items from mock data
    const userWishlistItems = wishlistItems.filter(item => item.userId === userId);
    
    return userWishlistItems;
  },
  
  addToWishlist: async (userId: string, productId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would add to the database
    // For demo, we'll update the mock data in memory
    
    // Check if already in wishlist
    const existingItem = wishlistItems.find(
      item => item.userId === userId && item.productId.toString() === productId
    );
    
    if (!existingItem) {
      // Add new item
      const newItem = {
        id: generateId(),
        productId: productId,
        userId: userId,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      
      wishlistItems.push(newItem);
      
      // Dispatch event to update UI
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
    
    return { success: true };
  },
  
  removeFromWishlist: async (userId: string, productId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would remove from the database
    // For demo, we'll update the mock data in memory
    
    const index = wishlistItems.findIndex(
      item => item.userId === userId && item.productId.toString() === productId
    );
    
    if (index !== -1) {
      wishlistItems.splice(index, 1);
      
      // Dispatch event to update UI
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
    
    return { success: true };
  }
};

// Orders service
export const mockOrdersService = {
  // Get user's orders
  getUserOrders: async (userId: string) => {
    await delay(800);
    return ordersData.filter(order => order.userId === userId);
  },
  
  // Get order by ID
  getOrderById: async (id: number | string) => {
    await delay(600);
    const orderId = typeof id === 'string' ? parseInt(id) : id;
    return ordersData.find(order => order.id === orderId);
  },
  
  // Create a new order
  createOrder: async (orderData: any) => {
    await delay(1000);
    const newOrder = {
      id: ordersData.length + 1,
      ...orderData,
      createdAt: new Date().toISOString()
    };
    
    ordersData.push(newOrder);
    return newOrder;
  },
  
  // Update order status
  updateOrderStatus: async (id: number | string, status: string) => {
    await delay(700);
    const orderId = typeof id === 'string' ? parseInt(id) : id;
    const index = ordersData.findIndex(order => order.id === orderId);
    
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    ordersData[index].status = status;
    return ordersData[index];
  },
  getOrders: async () => {
    await simulateApiDelay<void>(undefined);
    
    // Import mock data
    
    
    // Create mock orders with product information
    const mockOrders = [
      {
        id: "order1",
        productId: "1",
        quantity: 1,
        status: "COMPLETED",
        paymentMethod: "ONLINE",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        product: products.find(p => p.id === 'prod1') || {
          name: "Wireless Headphones",
          price: "89.99",
          imageUrls: ["/placeholder.svg?height=100&width=100"]
        }
      },
      {
        id: "order2",
        productId: "3",
        quantity: 2,
        status: "PROCESSING",
        paymentMethod: "DELIVERY",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        product: products.find(p => p.id === 'prod3') || {
          name: "Smart Watch",
          price: "199.99",
          imageUrls: ["/placeholder.svg?height=100&width=100"]
        }
      },
      {
        id: "order3",
        productId: "5",
        quantity: 1,
        status: "PENDING",
        paymentMethod: "ONLINE",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        product: products.find(p => p.id === 'prod5') || {
          name: "Bluetooth Speaker",
          price: "59.99",
          imageUrls: ["/placeholder.svg?height=100&width=100"]
        }
      }
    ];
    
    return { data: mockOrders };
  }
};

// Messages service
export const mockMessagesService = {
  // Get messages for an order
  getOrderMessages: async (orderId: number | string) => {
    await delay(700);
    const id = typeof orderId === 'string' ? parseInt(orderId) : orderId;
    return messagesData.filter(message => message.orderId === id);
  },
  
  // Send a message
  sendMessage: async (messageData: any) => {
    await delay(600);
    const newMessage = {
      id: messagesData.length + 1,
      ...messageData,
      timestamp: new Date().toISOString()
    };
    
    messagesData.push(newMessage);
    return newMessage;
  }
};

// Sellers service
export const mockSellersService = {
  // Get all sellers
  getAllSellers: async () => {
    await delay(700);
    return sellersData;
  },
  
  // Get seller by ID
  getSellerById: async (id: number | string) => {
    await delay(600);
    const sellerId = typeof id === 'string' ? parseInt(id) : id;
    return sellersData.find(seller => seller.id === sellerId);
  },
  
  // Get seller's products
  getSellerProducts: async (sellerId: number | string) => {
    await delay(800);
    const id = typeof sellerId === 'string' ? parseInt(sellerId) : sellerId;
    return productsData.filter(product => product.seller.id === id);
  }
};

// Auth service (mock)
export const mockAuthService = {
  // Login
  login: async (email: string, password: string) => {
    await delay(1000);
    // This would be handled by the auth context now
    return { success: true };
  },
  
  // Register
  register: async (userData: any) => {
    await delay(1200);
    // This would be handled by the auth context now
    return { success: true };
  }
};

// Mock Payment Service
export const mockPaymentService = {
  initiatePayment: async (paymentData: any) => {
    // This would normally call the payment API
    // For the prototype, we'll simulate a successful payment initiation
    try {
      const response = await fetch('http://localhost:6160/api/v1/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error initiating payment:', error);
      // Fallback to mock response if the real API is not available
      return {
        message: "Payment initiated successfully",
        data: {
          checkoutUrl: "https://sandbox-pay.squadco.com/TRX_" + Date.now(),
          transactionRef: "TRX_" + Date.now()
        }
      };
    }
  },
  
  verifyPayment: async (reference: string) => {
    // In a real app, this would verify the payment with the payment provider
    // For the prototype, we'll simulate a successful payment verification
    return simulateApiDelay({
      success: true,
      data: {
        reference,
        status: 'success',
        amount: 15000,
        paidAt: new Date().toISOString(),
      },
    });
  },
};

// Mock File Upload Service
export const mockFileUploadService = {
  uploadImage: async (file: File) => {
    // In a real app, this would upload the file to a storage service
    // For the prototype, we'll simulate a successful upload
    return simulateApiDelay({
      success: true,
      url: URL.createObjectURL(file),
    });
  },
  
  uploadMultipleImages: async (files: File[]) => {
    // In a real app, this would upload multiple files to a storage service
    // For the prototype, we'll simulate a successful upload
    const urls = files.map((file) => URL.createObjectURL(file));
    return simulateApiDelay({
      success: true,
      urls,
    });
  },
};

