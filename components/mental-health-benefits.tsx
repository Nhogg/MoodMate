import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MentalHealthBenefits() {
  return (
    <section id="benefits" className="py-16 bg-teal-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Mental Health Benefits</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover how AI-enhanced journaling can significantly improve your mental well-being.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Reduced Anxiety & Stress</CardTitle>
              <CardDescription>
                Regular journaling has been shown to reduce anxiety and stress levels by up to 28%.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Our AI identifies stress patterns in your writing and provides personalized techniques to help manage
                anxiety. Users report feeling calmer and more centered after just 2 weeks of consistent journaling.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Improved Self-Awareness</CardTitle>
              <CardDescription>Gain deeper insights into your thoughts, feelings, and behaviors.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                The AI analyzes your emotional patterns over time, helping you recognize triggers and develop healthier
                responses. This increased self-awareness is a cornerstone of emotional intelligence and mental wellness.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Better Sleep Quality</CardTitle>
              <CardDescription>Studies show journaling before bed can improve sleep quality by 15-20%.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Evening journaling helps process the day's events and clear your mind. Our AI can suggest optimal
                journaling times based on your entries and sleep patterns to maximize this benefit.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Emotional Regulation</CardTitle>
              <CardDescription>Learn to better understand and manage your emotions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                By tracking emotional trends in your journal entries, our AI helps you develop strategies for regulating
                difficult emotions. Users report feeling more in control of their emotional responses after consistent
                use.
              </p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Clinically Supported Benefits</CardTitle>
              <CardDescription>Research-backed mental health improvements from regular journaling.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-teal-600 mb-2">76%</div>
                  <p className="text-center text-sm">of users report reduced symptoms of depression after 30 days</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-teal-600 mb-2">82%</div>
                  <p className="text-center text-sm">experience improved mood regulation and emotional resilience</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-teal-600 mb-2">68%</div>
                  <p className="text-center text-sm">report better ability to manage stress in daily life</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
