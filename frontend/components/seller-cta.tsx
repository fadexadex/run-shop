import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SellerCTA() {
  return (
    <section className="w-full py-12 md:py-24 bg-black text-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Start Selling on RUNShop Today</h2>
            <p className="mt-4 text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Turn your passion into profit. Reach thousands of students on campus with your products or services. Easy
              setup, powerful tools, and instant payments.
            </p>
            <div className="mt-8">
              <Link href="/auth?mode=register&type=seller">
                <Button className="bg-white text-black hover:bg-gray-100">Become a Seller</Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Seller on RUNShop"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="text-3xl font-bold mb-2">1000+</div>
            <p className="text-gray-300">Active Buyers</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="text-3xl font-bold mb-2">100+</div>
            <p className="text-gray-300">Campus Sellers</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="text-3xl font-bold mb-2">500+</div>
            <p className="text-gray-300">Daily Orders</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="text-3xl font-bold mb-2">₦1M+</div>
            <p className="text-gray-300">Monthly Sales</p>
          </div>
        </div>
      </div>
    </section>
  )
}

