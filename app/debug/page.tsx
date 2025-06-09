"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DebugPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testGeminiAPI = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-gemini")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }

  const testInsightsAPI = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content:
            "Today I felt really happy and grateful for all the good things in my life. The weather was beautiful and I spent time with friends.",
          emotion: "joy",
          emotion_probabilities: {
            joy: 0.8,
            neutral: 0.1,
            sadness: 0.05,
            anger: 0.03,
            fear: 0.02,
            disgust: 0.0,
          },
          mood: "happy",
        }),
      })
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Gemini API Debug</CardTitle>
          <CardDescription>Test your Gemini API integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testGeminiAPI} disabled={isLoading}>
              Test Gemini Connection
            </Button>
            <Button onClick={testInsightsAPI} disabled={isLoading} variant="outline">
              Test Insights API
            </Button>
          </div>

          {testResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={testResult.success ? "default" : "destructive"}>
                  {testResult.success ? "Success" : "Error"}
                </Badge>
                {testResult.status && <Badge variant="outline">Status: {testResult.status}</Badge>}
              </div>

              <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
