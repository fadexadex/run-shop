import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Navbar from "./components/navbar"
import Carousel from "./components/Carousel"
import Products from "./components/products"
import ProductDetails from "./components/ProductDetails"
import Categories from "./components/Categories"
import CategoryProducts from "./components/CategoryProducts"
import HeroSection from "./components/hero-section"
import Footer from "./components/footer"
import SearchResults from "./components/SearchResults"
import Wishlist from "./components/Wishlist"

const Home = () => (
  <>
    <HeroSection />
    <Carousel />
    <Categories />
    <Products />
  </>
)

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:categoryId" element={<CategoryProducts />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  )
}

export default App

