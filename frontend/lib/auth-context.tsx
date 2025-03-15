"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"

// Update the User interface to include sellerCompleted
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "CUSTOMER" | "SELLER"
  hostelName?: string
  blockNumber?: number
  roomNo?: number
  businessName?: string
  phoneNumber?: string
  bankName?: string
  accountNumber?: string
  wishlist?: {
    id: string
  }
  sellerCompleted?: boolean
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  hostelName?: string
  blockNumber?: number
  roomNo?: number
  role?: "CUSTOMER" | "SELLER"
  businessName?: string
  phoneNumber?: string
  bankName?: string
  accountNumber?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (userData: {
    firstName?: string
    lastName?: string
    hostelName?: string
    blockNumber?: number
    roomNo?: number
    businessName?: string
    phoneNumber?: string
    bankName?: string
    accountNumber?: string
  }) => Promise<void>
  updateSellerStatus: (completed: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data
const mockUsers = [
  {
    id: "user1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    role: "CUSTOMER",
    hostelName: "Prophet Moses",
    blockNumber: 10,
    roomNo: 7,
    sellerCompleted: false,
  },
  {
    id: "user2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "password123",
    role: "SELLER",
    hostelName: "Prophet Moses",
    blockNumber: 12,
    roomNo: 5,
    businessName: "Jane's Shop",
    phoneNumber: "08012345678",
    bankName: "First Bank",
    accountNumber: "1234567890",
    sellerCompleted: true,
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "user1",
    email: "demo@example.com",
    firstName: "Demo",
    lastName: "User",
    role: "BUYER",
    sellerCompleted: false,
    hostelName: "Prophet Moses",
    blockNumber: 10,
    roomNo: 7,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Get user ID from token (in a real app, you'd decode the token)
        const userId = localStorage.getItem("userId")

        if (userId) {
          // Find user in mock data
          const foundUser = mockUsers.find((u) => u.id === userId)
          if (foundUser) {
            // Remove password before setting user
            const { password, ...userWithoutPassword } = foundUser
            setUser(userWithoutPassword as User)
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        localStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user in mock data
      const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

      // if (!foundUser) {
      //   throw new Error("Invalid email or password")
      // }

      // // Create a mock token
      // const token = `mock-token-${Date.now()}`
      // localStorage.setItem("token", token)
      // localStorage.setItem("userId", foundUser.id)

      // // Remove password before setting user
      // const { password: _, ...userWithoutPassword } = foundUser
      // setUser(userWithoutPassword as User)

      // return userWithoutPassword
      let userData
      userData = {
        id: "user123",
        email: email,
        firstName: "John",
        lastName: "Doe",
        role: "CUSTOMER",
        hostelName: "Prophet Moses",
        blockNumber: 10,
        roomNo: 7,
        wishlist: [],
      }
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Check if email already exists
      if (mockUsers.some((u) => u.email === userData.email)) {
        throw new Error("Email already in use")
      }

      // Create new user
      const newUser = {
        id: `user${mockUsers.length + 1}`,
        ...userData,
        sellerCompleted: false,
      }

      // In a real app, you'd save this to a database
      mockUsers.push(newUser as any)

      // Create a mock token
      const token = `mock-token-${Date.now()}`
      localStorage.setItem("token", token)
      localStorage.setItem("userId", newUser.id)

      // Remove password before setting user
      const { password, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword as User)

      return { token, user: userWithoutPassword }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (userData: {
    firstName?: string
    lastName?: string
    hostelName?: string
    blockNumber?: number
    roomNo?: number
    businessName?: string
    phoneNumber?: string
    bankName?: string
    accountNumber?: string
  }) => {
    setIsLoading(true)
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (!user) {
        throw new Error("Not authenticated")
      }

      // Update user in mock data
      const userIndex = mockUsers.findIndex((u) => u.id === user.id)
      if (userIndex >= 0) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          ...userData,
        }

        // Update current user
        setUser({
          ...user,
          ...userData,
        })
      }
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateSellerStatus = useCallback((status: boolean) => {
    setUser((prevUser) => {
      if (!prevUser) return null
      return {
        ...prevUser,
        sellerCompleted: status,
      }
    })
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile, updateSellerStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

