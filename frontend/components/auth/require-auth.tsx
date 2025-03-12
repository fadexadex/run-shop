"use client"

import { type ReactNode, useState } from "react"
import { useAuth } from "./auth-context"
import AuthModal from "./auth-modal"

interface RequireAuthProps {
  children: ReactNode | ((isAuthenticated: boolean) => ReactNode)
  fallback?: ReactNode
  message?: string
}

export default function RequireAuth({ children, fallback, message }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // If still loading auth state, show nothing or a loading indicator
  if (isLoading) {
    return null
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return typeof children === "function" ? children(true) : children
  }

  // If not authenticated and there's a fallback, render it
  if (fallback) {
    return (
      <>
        {fallback}
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            message={message || "Please login or create an account to continue"}
          />
        )}
      </>
    )
  }

  // If not authenticated and no fallback, render auth modal trigger
  return (
    <>
      <div onClick={() => setShowAuthModal(true)}>{typeof children === "function" ? children(false) : children}</div>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          message={message || "Please login or create an account to continue"}
        />
      )}
    </>
  )
}

