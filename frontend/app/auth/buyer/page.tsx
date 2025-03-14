"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { ShoppingBag, ArrowLeft, User, Lock, Mail, Home, Building, DoorClosed } from "lucide-react"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { loginValidation, buyerSignUpValidation } from "@/lib/validation"

export default function BuyerAuthPage() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") || "register"

  const [mode, setMode] = useState(initialMode)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const { login, register, user } = useAuth()

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    hostelName: "",
    blockNumber: "",
    roomNo: "",
  })

  useEffect(() => {
    // Update the URL when mode changes
    const params = new URLSearchParams()
    params.set("mode", mode)
    router.replace(`/auth/buyer?${params.toString()}`)
  }, [mode, router])

  // Check if user is already logged in and redirect to account page
  // Since this is the buyer auth section, we always redirect to account
  useEffect(() => {
    if (user && !isLoading) {
      console.log("User already logged in:", user)
      router.push("/account")
    }
  }, [user, isLoading, router])

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))

    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))

    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationErrors({})

    // Validate form
    const errors = loginValidation(loginData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password)
      // Since this is the buyer auth section, always redirect to account
      router.push("/account")
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationErrors({})

    // Validate form
    const errors = buyerSignUpValidation(registerData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      await register({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        hostelName: registerData.hostelName,
        blockNumber: Number.parseInt(registerData.blockNumber),
        roomNo: Number.parseInt(registerData.roomNo),
        role: "CUSTOMER",
      })

      // Since this is the buyer auth section, redirect to account
      router.push("/account")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-[#008ECC]">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#008ECC]/10 rounded-full flex items-center justify-center">
                {mode === "login" ? (
                  <User className="h-8 w-8 text-[#008ECC]" />
                ) : (
                  <ShoppingBag className="h-8 w-8 text-[#008ECC]" />
                )}
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-6 text-center">
              {mode === "login" ? "Welcome Back" : "Create a Buyer Account"}
            </h1>

            <Tabs defaultValue={mode} onValueChange={setMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <FormError message={error} />

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      className={`mt-1 ${validationErrors.email ? "border-red-500" : ""}`}
                    />
                    {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Password
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className={`mt-1 ${validationErrors.password ? "border-red-500" : ""}`}
                    />
                    {validationErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#008ECC] focus:ring-[#008ECC] border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link href="/auth/forgot-password" className="text-[#008ECC] hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#008ECC] text-white hover:bg-[#007bb3]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>

                  <div className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-[#008ECC] hover:underline"
                    >
                      Register
                    </button>
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-600">
                    Are you a seller?{" "}
                    <Link href="/auth/seller?mode=login" className="text-[#008ECC] hover:underline">
                      Login as Seller
                    </Link>
                  </div>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <FormError message={error} />
                <FormSuccess message={success} />

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={registerData.firstName}
                        onChange={handleRegisterChange}
                        required
                        className={`mt-1 ${validationErrors.firstName ? "border-red-500" : ""}`}
                      />
                      {validationErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={registerData.lastName}
                        onChange={handleRegisterChange}
                        required
                        className={`mt-1 ${validationErrors.lastName ? "border-red-500" : ""}`}
                      />
                      {validationErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                      className={`mt-1 ${validationErrors.email ? "border-red-500" : ""}`}
                    />
                    {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="hostelName" className="flex items-center gap-2">
                      <Home className="h-4 w-4" /> Hostel Name
                    </Label>
                    <Input
                      type="text"
                      id="hostelName"
                      name="hostelName"
                      value={registerData.hostelName}
                      onChange={handleRegisterChange}
                      required
                      className={`mt-1 ${validationErrors.hostelName ? "border-red-500" : ""}`}
                      placeholder="e.g. Prophet Moses"
                    />
                    {validationErrors.hostelName && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.hostelName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="blockNumber" className="flex items-center gap-2">
                        <Building className="h-4 w-4" /> Block Number
                      </Label>
                      <Input
                        type="number"
                        id="blockNumber"
                        name="blockNumber"
                        value={registerData.blockNumber}
                        onChange={handleRegisterChange}
                        required
                        className={`mt-1 ${validationErrors.blockNumber ? "border-red-500" : ""}`}
                        placeholder="e.g. 10"
                      />
                      {validationErrors.blockNumber && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.blockNumber}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="roomNo" className="flex items-center gap-2">
                        <DoorClosed className="h-4 w-4" /> Room Number
                      </Label>
                      <Input
                        type="number"
                        id="roomNo"
                        name="roomNo"
                        value={registerData.roomNo}
                        onChange={handleRegisterChange}
                        required
                        className={`mt-1 ${validationErrors.roomNo ? "border-red-500" : ""}`}
                        placeholder="e.g. 7"
                      />
                      {validationErrors.roomNo && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.roomNo}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Password
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      className={`mt-1 ${validationErrors.password ? "border-red-500" : ""}`}
                    />
                    {validationErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                      className={`mt-1 ${validationErrors.confirmPassword ? "border-red-500" : ""}`}
                    />
                    {validationErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-[#008ECC] focus:ring-[#008ECC] border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#008ECC] hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#008ECC] hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#008ECC] text-white hover:bg-[#007bb3]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <div className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setMode("login")} className="text-[#008ECC] hover:underline">
                      Log In
                    </button>
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-600">
                    Want to sell on RUNShop?{" "}
                    <Link href="/auth/seller?mode=register" className="text-[#008ECC] hover:underline">
                      Register as Seller
                    </Link>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

