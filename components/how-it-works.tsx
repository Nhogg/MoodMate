export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI-powered journaling platform makes it easy to capture, analyze, and benefit from your thoughts.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
              <span className="text-2xl font-bold text-teal-700">1</span>
            </div>
            <h3 className="text-xl font-bold">Create or Upload</h3>
            <p className="text-gray-500">
              Either type your journal entry directly in our editor or upload photos of your handwritten journal pages.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
              <span className="text-2xl font-bold text-teal-700">2</span>
            </div>
            <h3 className="text-xl font-bold">AI Analysis</h3>
            <p className="text-gray-500">
              Our AI analyzes your entries to identify patterns, emotions, and potential insights about your mental
              well-being.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
              <span className="text-2xl font-bold text-teal-700">3</span>
            </div>
            <h3 className="text-xl font-bold">Receive Insights</h3>
            <p className="text-gray-500">
              Get personalized insights, track your emotional trends over time, and receive suggestions for improving
              your mental health.
            </p>
          </div>
        </div>
        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-4xl rounded-lg overflow-hidden shadow-xl">
            <img
              alt="How the journaling app works"
              className="object-cover w-full"
              src="/placeholder.svg?height=500&width=1200"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
