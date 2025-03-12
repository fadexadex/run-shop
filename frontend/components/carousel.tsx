"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Carousel = () => {
  // Internal slides data
  const slides = [
    {
      title: "New Sales",
      description:
        "Find the latest deals and discounts on a wide range of products. Limited time offers available now.",
      image: "/placeholder.svg?height=600&width=1200",
      buttonText: "Shop Now",
      link: "/products",
    },
    {
      title: "Food & Drinks",
      description:
        "Discover delicious meals, snacks, and beverages from local vendors. Quick delivery options available.",
      image: "/placeholder.svg?height=600&width=1200",
      buttonText: "Shop Now",
      link: "/category/food",
    },
    {
      title: "Clothing & Accessories",
      description: "Stay stylish with our collection of trendy clothing and accessories. New arrivals every week.",
      image: "/placeholder.svg?height=600&width=1200",
      buttonText: "Shop Now",
      link: "/category/clothing",
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <div className="relative h-[50vh] overflow-hidden">
      {/* Slides */}
      <div className="h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Image */}
            <div className="absolute inset-0">
              <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Text content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-10">
              <h2
                className="text-white text-2xl md:text-4xl font-bold mb-4 transform transition-transform duration-700 ease-out"
                style={{
                  transform: index === currentSlide ? "translateY(0)" : "translateY(20px)",
                  opacity: index === currentSlide ? 1 : 0,
                  transition: "transform 0.7s ease, opacity 0.7s ease",
                }}
              >
                {slide.title}
              </h2>
              <p
                className="text-white text-sm md:text-lg max-w-2xl"
                style={{
                  transform: index === currentSlide ? "translateY(0)" : "translateY(20px)",
                  opacity: index === currentSlide ? 1 : 0,
                  transition: "transform 0.7s ease 0.2s, opacity 0.7s ease 0.2s",
                }}
              >
                {slide.description}
              </p>
              {slide.buttonText && (
                <Link href={slide.link}>
                  <Button
                    className="mt-6 px-6 py-2 bg-white text-black hover:bg-opacity-90 transition-all"
                    style={{
                      transform: index === currentSlide ? "translateY(0)" : "translateY(20px)",
                      opacity: index === currentSlide ? 1 : 0,
                      transition: "transform 0.7s ease 0.4s, opacity 0.7s ease 0.4s",
                    }}
                  >
                    {slide.buttonText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white scale-125" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default Carousel

