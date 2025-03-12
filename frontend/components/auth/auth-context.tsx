"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authAPI } from "@/lib/api"
import { jwtDecode } from "jwt-decode"

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "CUSTOMER" | "SELLER" | "ADMIN"
  shippingAddress?: string
  sellerId?: string
}

interface DecodedToken {
  userId: string
  email: string
  role: "CUSTOMER" | "SELLER" | "ADMIN"
  sellerId?: string
  iat: number
  exp: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    shippingAddress?: string
    role: "CUSTOMER" | "SELLER"
    catalogueName?: string
    paymentMethod?: "ONLINE" | "CASH"
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if token exists and is valid on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      const token = localStorage.getItem("runshop_token")

      if (token) {
        try {
          // Verify token validity
          const decoded = jwtDecode<DecodedToken>(token)

          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("runshop_token")
            setUser(null)
            setIsAuthenticated(false)
          } else {
            // Get current user data
            try {
              const userData = await authAPI.getCurrentUser()
              setUser({
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: userData.role,
                shippingAddress: userData.shippingAddress,
                sellerId: userData.seller?.id,
              })
              setIsAuthenticated(true)
            } catch (error) {
              console.error("Error fetching user data:", error)
              localStorage.removeItem("runshop_token")
              setUser(null)
              setIsAuthenticated(false)
            }
          }
        } catch (error) {
          console.error("Invalid token:", error)
          localStorage.removeItem("runshop_token")
          setUser(null)
          setIsAuthenticated(false)
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(email, password)
      const { token, user: userData } = response

      // Store token
      localStorage.setItem("runshop_token", token)

      // Set user data
      setUser({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        shippingAddress: userData.shippingAddress,
        sellerId: userData.seller?.id,
      })

      setIsAuthenticated(true)
    } catch (error) {
      console.error("Login failed:", error)
      throw new Error("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    shippingAddress?: string
    role: "CUSTOMER" | "SELLER"
    catalogueName?: string
    paymentMethod?: "ONLINE" | "CASH"
  }) => {
    setIsLoading(true)
    try {
      const response = await authAPI.register(userData)
      const { token, user: registeredUser } = response

      // Store token
      localStorage.setItem("runshop_token", token)

      // Set user data
      setUser({
        id: registeredUser.id,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        email: registeredUser.email,
        role: registeredUser.role,
        shippingAddress: registeredUser.shippingAddress,
        sellerId: registeredUser.seller?.id,
      })

      setIsAuthenticated(true)
    } catch (error) {
      console.error("Signup failed:", error)
      throw new Error("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("runshop_token")
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, signup, logout }}>
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

