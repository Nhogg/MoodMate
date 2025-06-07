import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/hero-section"
import FeatureSection from "@/components/feature-section"
import HowItWorks from "@/components/how-it-works"
import TestimonialSection from "@/components/testimonial-section"
import MentalHealthBenefits from "@/components/mental-health-benefits"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-teal-600"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M10.96 12.48a2.67 2.67 0 1 1-5.33 0 2.67 2.67 0 0 1 5.33 0z" />
              <path d="M18.67 19.15c-.24-1.94-1.7-3.48-3.67-3.48h-1.47c-1.97 0-3.43 1.54-3.67 3.48" />
            </svg>
            <span className="text-xl font-semibold">MindfulJournal</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline">
              How It Works
            </Link>
            <Link href="#benefits" className="text-sm font-medium hover:underline">
              Mental Health Benefits
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <HowItWorks />
        <MentalHealthBenefits />
        <TestimonialSection />
        <section className="py-20 bg-teal-50">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Ready to transform your journaling experience?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have improved their mental well-being through AI-enhanced journaling.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="px-8">
                Start Your Journal Today
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-sm text-muted-foreground">© 2024 MindfulJournal. All rights reserved.</p>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="#" className="text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-muted-foreground hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
