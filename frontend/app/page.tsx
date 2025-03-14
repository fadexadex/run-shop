import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Users, Clock, Shield, Star, ArrowRight, Store } from "lucide-react"
import CategoryProductsSection from "@/components/category-products-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Auth Options */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-[#008ECC] to-[#005A82] text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Campus Shopping <span className="text-yellow-300">Made Easy</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
                  Connect directly with trusted student sellers at Redeemer's University. From essentials to unique
                  finds, everything you need is just a click away.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold">100+</p>
                  <p className="text-sm">Campus Sellers</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold">1000+</p>
                  <p className="text-sm">Products</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm">Support</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-center">Join RUNShop Today</h2>
              <div className="grid gap-6">
                <Link href="/auth/buyer">
                  <Button className="w-full h-16 bg-white text-[#008ECC] hover:bg-gray-100 text-lg font-medium flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-6 w-6" />
                      <span>Shop as a Customer</span>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/30"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#008ECC] px-2 text-sm text-white/70">or</span>
                  </div>
                </div>

                <Link href="/auth/seller">
                  <Button
                    variant="outline"
                    className="w-full h-16 bg-[#008ECC] border-white text-white hover:bg-white/10 text-lg font-medium flex items-center justify-between px-6"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="h-6 w-6" />
                      <span>Sell on Our Platform</span>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <p className="text-center text-sm text-white/70">
                Already have an account?{" "}
                <Link href="/auth/buyer?mode=login" className="underline hover:text-white">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How RUNShop Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connecting students with campus sellers has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#008ECC]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-6 w-6 text-[#008ECC]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
              <p className="text-gray-600">
                Explore a wide range of products from trusted campus sellers, all in one place.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#008ECC]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-[#008ECC]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Directly</h3>
              <p className="text-gray-600">
                Chat with sellers, ask questions, and arrange meetups or delivery on campus.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#008ECC]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-[#008ECC]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Delivery</h3>
              <p className="text-gray-600">
                Get your items delivered to your hostel or pick them up at convenient campus locations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CategoryProductsSection />

      {/* Why Choose Us Section */}
      <section className="py-16 bg-[#008ECC] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose RUNShop?</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              The ultimate campus marketplace built specifically for Redeemer's University students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
                <p className="text-white/80">
                  All sellers are verified students or staff members of Redeemer's University, creating a safe and
                  trusted marketplace.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Convenience</h3>
                <p className="text-white/80">
                  Save time with on-campus delivery and pickup options. No need to leave campus for your shopping needs.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                <p className="text-white/80">
                  From homemade food to tech gadgets, find high-quality products tailored to student needs.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Support Student Entrepreneurs</h3>
                <p className="text-white/80">
                  By shopping on RUNShop, you're directly supporting your fellow students' businesses and side hustles.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button className="bg-white text-[#008ECC] hover:bg-gray-100">Start Shopping Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

