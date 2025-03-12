import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">RUNShop</h3>
            <p className="text-gray-600 mb-4">
              The ultimate shop for Redeemer&apos;s University students, making purchases more efficient and empowering
              businesses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-black">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-black">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/clothing" className="text-gray-600 hover:text-black">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="text-gray-600 hover:text-black">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/category/food" className="text-gray-600 hover:text-black">
                  Food & Drinks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-gray-600 hover:text-black">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-gray-600 hover:text-black">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-600 hover:text-black">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-600 hover:text-black">
                  Sell on RUNShop
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-black">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-black">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-black">
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-black">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} RUNShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

