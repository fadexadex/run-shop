"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/lib/auth-context"
import { ShoppingBag, Store, ArrowLeft, User, Lock, Mail, Phone, Building, CreditCard } from "lucide-react"

// Import the new form error and success components
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") || "login"
  const initialType = searchParams.get("type") || "buyer"

  const [mode, setMode] = useState<string>(initialMode)
  const [userType, setUserType] = useState<string>(initialType)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const router = useRouter()
  const { login, register } = useAuth()

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
    shippingAddress: "",
    // Seller specific fields
    businessName: "",
    businessDescription: "",
    phoneNumber: "",
    bankName: "",
    accountNumber: "",
  })

  useEffect(() => {
    // Update the URL when mode or type changes
    const params = new URLSearchParams()
    params.set("mode", mode)
    if (mode === "register") {
      params.set("type", userType)
    } else {
      params.delete("type")
    }

    router.replace(`/auth?${params.toString()}`)
  }, [mode, userType, router])

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password)
      // Redirect based on user role
      if (userType === "seller") {
        router.push("/seller/dashboard")
      } else {
        router.push("/account")
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the handleRegisterSubmit function to use CUSTOMER role
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Form validation
    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      if (userType === "buyer") {
        await register({
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.email,
          password: registerData.password,
          shippingAddress: registerData.shippingAddress,
          role: "CUSTOMER", // Changed from BUYER to CUSTOMER
        })
        router.push("/account")
      } else {
        // For seller registration, redirect to onboarding after registration
        await register({
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.email,
          password: registerData.password,
          shippingAddress: registerData.shippingAddress,
          role: "SELLER", // This seems to be correct
        })
        router.push("/seller/onboarding")
      }
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
              {mode === "login" ? (
                <div className="w-16 h-16 bg-[#008ECC]/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-[#008ECC]" />
                </div>
              ) : userType === "buyer" ? (
                <div className="w-16 h-16 bg-[#008ECC]/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-[#008ECC]" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-[#008ECC]/10 rounded-full flex items-center justify-center">
                  <Store className="h-8 w-8 text-[#008ECC]" />
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold mb-6 text-center">
              {mode === "login"
                ? "Welcome Back"
                : userType === "buyer"
                  ? "Create a Buyer Account"
                  : "Create a Seller Account"}
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
                      className="mt-1"
                    />
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
                      className="mt-1"
                    />
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
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <FormError message={error} />
                <FormSuccess message={success} />

                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">I want to:</Label>
                  <RadioGroup value={userType} onValueChange={setUserType} className="flex space-x-4">
                    <div className="flex-1">
                      <div
                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                          userType === "buyer"
                            ? "border-[#008ECC] bg-[#008ECC]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setUserType("buyer")}
                      >
                        <ShoppingBag
                          className={`h-6 w-6 ${userType === "buyer" ? "text-[#008ECC]" : "text-gray-500"}`}
                        />
                        <RadioGroupItem value="buyer" id="buyer" className="sr-only" />
                        <Label htmlFor="buyer" className={userType === "buyer" ? "text-[#008ECC]" : "text-gray-700"}>
                          Buy Products
                        </Label>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div
                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                          userType === "seller"
                            ? "border-[#008ECC] bg-[#008ECC]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setUserType("seller")}
                      >
                        <Store className={`h-6 w-6 ${userType === "seller" ? "text-[#008ECC]" : "text-gray-500"}`} />
                        <RadioGroupItem value="seller" id="seller" className="sr-only" />
                        <Label htmlFor="seller" className={userType === "seller" ? "text-[#008ECC]" : "text-gray-700"}>
                          Sell Products
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

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
                        className="mt-1"
                      />
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
                        className="mt-1"
                      />
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
                      className="mt-1"
                    />
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
                      className="mt-1"
                    />
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
                      className="mt-1"
                    />
                  </div>

                  {userType === "buyer" && (
                    <div>
                      <Label htmlFor="shippingAddress">Shipping Address</Label>
                      <Textarea
                        id="shippingAddress"
                        name="shippingAddress"
                        value={registerData.shippingAddress}
                        onChange={handleRegisterChange}
                        rows={3}
                        required
                        className="mt-1"
                      />
                    </div>
                  )}

                  {userType === "seller" && (
                    <>
                      <div>
                        <Label htmlFor="businessName" className="flex items-center gap-2">
                          <Building className="h-4 w-4" /> Business Name
                        </Label>
                        <Input
                          type="text"
                          id="businessName"
                          name="businessName"
                          value={registerData.businessName}
                          onChange={handleRegisterChange}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Phone Number
                        </Label>
                        <Input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={registerData.phoneNumber}
                          onChange={handleRegisterChange}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bankName" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Bank Name
                          </Label>
                          <Input
                            type="text"
                            id="bankName"
                            name="bankName"
                            value={registerData.bankName}
                            onChange={handleRegisterChange}
                            required
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            value={registerData.accountNumber}
                            onChange={handleRegisterChange}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </>
                  )}

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
                    {isLoading
                      ? "Creating Account..."
                      : userType === "seller"
                        ? "Continue to Onboarding"
                        : "Create Account"}
                  </Button>

                  <div className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setMode("login")} className="text-[#008ECC] hover:underline">
                      Log In
                    </button>
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

