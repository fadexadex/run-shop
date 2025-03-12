import Link from "next/link"

export default function Categories() {
  const categories = [
    {
      id: "clothing",
      name: "Clothing",
      image: "/placeholder.svg?height=300&width=300",
      description: "Stylish and comfortable clothing for all occasions",
    },
    {
      id: "accessories",
      name: "Accessories",
      image: "/placeholder.svg?height=300&width=300",
      description: "Complete your look with our range of accessories",
    },
    {
      id: "electronics",
      name: "Electronics",
      image: "/placeholder.svg?height=300&width=300",
      description: "The latest gadgets and electronic devices",
    },
    {
      id: "food",
      name: "Food & Drinks",
      image: "/placeholder.svg?height=300&width=300",
      description: "Delicious meals and refreshing beverages",
    },
  ]

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2 className="text-3xl font-bold md:text-4xl">Shop by Category</h2>
          <p className="mt-4 text-gray-600 max-w-2xl">
            Browse our wide range of products across different categories to find exactly what you need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link href={`/category/${category.id}`} key={category.id} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <div className="flex items-center text-black font-medium">
                    <span>Browse Category</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

