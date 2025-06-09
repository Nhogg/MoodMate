"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function TestEntryPage() {
  const [title, setTitle] = useState("Test Entry")
  const [content, setContent] = useState("This is a test entry to debug database saving.")
  const [mood, setMood] = useState("happy")
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testEntryCreation = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-entry-creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, mood }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Entry Creation</CardTitle>
          <CardDescription>Debug entry creation to Supabase database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Entry title" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Entry content"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mood</label>
            <Input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="Mood" />
          </div>

          <Button onClick={testEntryCreation} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test Entry Creation"}
          </Button>

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? "Success" : "Error"}
                </Badge>
              </div>

              <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
