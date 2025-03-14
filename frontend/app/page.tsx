import HeroSection from "@/components/hero-section"
import FeaturedCategories from "@/components/featured-categories"
import TrendingProducts from "@/components/trending-products"
import SellerCTA from "@/components/seller-cta"
import Testimonials from "@/components/testimonials"
import Newsletter from "@/components/newsletter"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedCategories />
      <TrendingProducts />
      <SellerCTA />
      <Testimonials />
      <Newsletter />
    </main>
  )
}

