import HeroSection from "@/components/hero-section"
import CategoryProductsSection from "@/components/category-products-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingBag, Users, Clock, Shield, Star } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How RUNShop Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connecting students with campus sellers has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
              <p className="text-gray-600">
                Explore a wide range of products from trusted campus sellers, all in one place.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Directly</h3>
              <p className="text-gray-600">
                Chat with sellers, ask questions, and arrange meetups or delivery on campus.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
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
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose RUNShop?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
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
                <p className="text-gray-300">
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
                <p className="text-gray-300">
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
                <p className="text-gray-300">
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
                <p className="text-gray-300">
                  By shopping on RUNShop, you're directly supporting your fellow students' businesses and side hustles.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button className="bg-white text-black hover:bg-gray-100">Start Shopping Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Become a Seller CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Have Something to Sell?</h2>
            <p className="text-xl mb-8">
              Turn your skills and products into income. Join RUNShop as a seller and reach the entire campus community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth?mode=register&type=seller">
                <Button className="bg-white text-black hover:bg-gray-100 px-8">Become a Seller</Button>
              </Link>
              <Link href="/seller/onboarding">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

