import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Transform Your Journaling with AI
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Enhance your mental well-being through AI-powered journaling that works with both digital and paper
                entries.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="px-8">
                  Start Journaling
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto lg:ml-auto flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <img
                alt="Journal app dashboard preview"
                className="object-cover w-full h-full"
                src="/placeholder.svg?height=600&width=800"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
