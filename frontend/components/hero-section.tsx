import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              The Ultimate Shop for Redeemer&apos;s University Students
            </h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Make purchases more efficiently and empower businesses to sell effectively. Find everything you need from
              food to clothing, all in one place.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/products">
                <Button className="bg-black text-white">Browse Products</Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline">Explore Categories</Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[500px] aspect-video overflow-hidden rounded-xl">
            <img alt="RUN Shop" className="object-cover w-full h-full" src="/placeholder.svg?height=600&width=800" />
          </div>
        </div>
      </div>
    </section>
  )
}

