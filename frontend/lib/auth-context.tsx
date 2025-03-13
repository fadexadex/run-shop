"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi } from "./api"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  shippingAddress: string
  wishlist?: {
    id: string
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    shippingAddress: string
  }) => Promise<void>
  logout: () => void
  updateProfile: (userData: {
    firstName?: string
    lastName?: string
    shippingAddress?: string
  }) => Promise<void>
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
        setUser(userData)
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
      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    shippingAddress: string
  }) => {
    setIsLoading(true)
    try {
      const { token } = await authApi.register(userData)
      localStorage.setItem("token", token)

      const userProfile = await authApi.getProfile()
      setUser(userProfile)
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
    shippingAddress?: string
  }) => {
    setIsLoading(true)
    try {
      await authApi.updateProfile(userData)

      // Refresh user data
      const updatedUserData = await authApi.getProfile()
      setUser(updatedUserData)
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
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

