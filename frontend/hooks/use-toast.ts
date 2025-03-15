"use client"

// Simple toast hook implementation
// In a real app, you'd use a library like react-hot-toast or sonner

import { useState } from "react"

interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...props, id }

    setToasts((prev) => [...prev, newToast])

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)

    return id
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toast, dismiss, toasts }
}

