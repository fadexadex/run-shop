"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi } from "./api"

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const userData = await authApi.getProfile()
        console.log("User profile data:", userData)

        // Handle the response structure with data property
        if (userData.data) {
          setUser(userData.data)
        } else {
          setUser(userData)
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
      const { token } = await authApi.login(email, password)
      localStorage.setItem("token", token)

      const userData = await authApi.getProfile()
      console.log("Login user data:", userData)

      // Handle the response structure with data property
      if (userData.data) {
        setUser(userData.data)
      } else {
        setUser(userData)
      }

      return userData.data || userData
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update the register function to handle the same form data for both buyer and seller
  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      console.log("Registering with data:", userData)
      const response = await authApi.register(userData)
      const { token, user: userProfile } = response

      // Store the token in localStorage
      localStorage.setItem("token", token)

      // Set the user state
      setUser(userProfile)

      return response
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
      await authApi.updateProfile(userData)

      // Refresh user data
      const updatedUserData = await authApi.getProfile()
      // Handle the response structure with data property
      if (updatedUserData.data) {
        setUser(updatedUserData.data)
      } else {
        setUser(updatedUserData)
      }
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Add a function to update the seller status
  const updateSellerStatus = (completed: boolean) => {
    if (user) {
      setUser({
        ...user,
        sellerCompleted: completed,
      })
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
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

