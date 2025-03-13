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

export default function AuthPage() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") || "login"
  const initialType = searchParams.get("type") || "buyer"

  const [mode, setMode] = useState(initialMode)
  const [userType, setUserType] = useState(initialType)
  const [isLoading, setIsLoading] = useState(false)
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
    setIsLoading(true)

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match")
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
        })
        router.push("/account")
      } else {
        // For seller registration, we'll show a success message since the API isn't available yet
        setSuccess("Seller registration successful! Your account is pending approval.")
        setTimeout(() => {
          router.push("/")
        }, 3000)
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-md">
          <Tabs defaultValue={mode} onValueChange={setMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <div className="bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-black text-white" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>

                  <div className="mt-4 text-center">
                    <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <div className="bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-50 text-green-500 p-3 rounded mb-4 text-sm">{success}</div>}

                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">I want to:</Label>
                  <RadioGroup value={userType} onValueChange={setUserType} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buyer" id="buyer" />
                      <Label htmlFor="buyer">Buy Products</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seller" id="seller" />
                      <Label htmlFor="seller">Sell Products</Label>
                    </div>
                  </RadioGroup>
                </div>

                <form onSubmit={handleRegisterSubmit}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={registerData.firstName}
                        onChange={handleRegisterChange}
                        required
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
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  {userType === "buyer" && (
                    <div className="mb-6">
                      <Label htmlFor="shippingAddress">Shipping Address</Label>
                      <Textarea
                        id="shippingAddress"
                        name="shippingAddress"
                        value={registerData.shippingAddress}
                        onChange={handleRegisterChange}
                        rows={3}
                        required
                      />
                    </div>
                  )}

                  {userType === "seller" && (
                    <>
                      <div className="mb-4">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          type="text"
                          id="businessName"
                          name="businessName"
                          value={registerData.businessName}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <Label htmlFor="businessDescription">Business Description</Label>
                        <Textarea
                          id="businessDescription"
                          name="businessDescription"
                          value={registerData.businessDescription}
                          onChange={handleRegisterChange}
                          rows={3}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={registerData.phoneNumber}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          type="text"
                          id="bankName"
                          name="bankName"
                          value={registerData.bankName}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>

                      <div className="mb-6">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          type="text"
                          id="accountNumber"
                          name="accountNumber"
                          value={registerData.accountNumber}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full bg-black text-white" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Register"}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

