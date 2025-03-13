import { Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    role: "Computer Science Student",
    content: "RUNShop has made campus life so much easier. I can get everything I need without leaving my hostel.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Business Administration Student",
    content:
      "As a seller on RUNShop, I've been able to grow my small business and reach more students than ever before.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Engineering Student",
    content: "The delivery is always prompt and the products are exactly as described. Highly recommend!",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export default function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2 className="text-3xl font-bold md:text-4xl">What Students Say</h2>
          <p className="mt-4 text-gray-600 max-w-2xl">
            Hear from students who have transformed their campus experience with RUNShop
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <Quote className="h-8 w-8 text-gray-300 mb-4" />
              <p className="text-gray-700 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

