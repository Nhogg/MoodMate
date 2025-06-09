"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { LogOut, User, Brain, ArrowLeft, Sparkles } from "lucide-react"
import { getJournalEntries, generateAIInsights, type JournalEntry } from "@/lib/journal-functions"
import { useToast } from "@/hooks/use-toast"

export default function InsightsPage() {
  const { user, signOut } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchEntries()
    }
  }, [user])

  const fetchEntries = async () => {
    try {
      const fetchedEntries = await getJournalEntries()
      setEntries(fetchedEntries)
    } catch (error) {
      console.error("Error fetching entries:", error)
      toast({
        title: "Error",
        description: "Failed to load journal entries.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateInsights = async () => {
    if (!selectedEntry) return

    setIsGenerating(true)
    try {
      const insights = await generateAIInsights(selectedEntry.id)
      setSelectedEntry({
        ...selectedEntry,
        ai_insights: insights.insights,
        ai_suggestions: insights.suggestions,
      })
      toast({
        title: "Success!",
        description: "AI insights generated successfully.",
      })
    } catch (error) {
      console.error("Error generating insights:", error)
      toast({
        title: "Error",
        description: "Failed to generate AI insights.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      joy: "text-green-600 bg-green-50",
      anger: "text-red-600 bg-red-50",
      sadness: "text-blue-600 bg-blue-50",
      fear: "text-purple-600 bg-purple-50",
      disgust: "text-yellow-600 bg-yellow-50",
      neutral: "text-gray-600 bg-gray-50",
    }
    return colors[emotion] || "text-gray-600 bg-gray-50"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-teal-600" />
              <span className="text-xl font-semibold">AI Insights</span>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/insights" className="text-sm font-medium text-teal-600">
              Insights
            </Link>
            <Link href="/calendar" className="text-sm font-medium">
              Calendar
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <div className="grid gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
              <p className="text-muted-foreground">
                Get AI-powered insights and suggestions based on your journal entries and emotional analysis.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select an Entry</CardTitle>
                  <CardDescription>Choose a journal entry to analyze</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={selectedEntry?.id || ""}
                    onValueChange={(value) => {
                      const entry = entries.find((e) => e.id === value)
                      setSelectedEntry(entry || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a journal entry" />
                    </SelectTrigger>
                    <SelectContent>
                      {entries.map((entry) => (
                        <SelectItem key={entry.id} value={entry.id}>
                          {entry.title} - {entry.displayDate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedEntry && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">{selectedEntry.title}</h3>
                        <p className="text-sm text-muted-foreground">{selectedEntry.displayDate}</p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm">{selectedEntry.content}</p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Mood: {selectedEntry.mood}
                        </span>
                        {selectedEntry.emotion && (
                          <span className={`px-2 py-1 text-xs rounded-full ${getEmotionColor(selectedEntry.emotion)}`}>
                            AI Emotion: {selectedEntry.emotion}
                          </span>
                        )}
                      </div>

                      {selectedEntry.emotion_probabilities && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Emotion Analysis</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(selectedEntry.emotion_probabilities).map(([emotion, probability]) => (
                              <div key={emotion} className="flex justify-between">
                                <span className="capitalize">{emotion}:</span>
                                <span>{(probability * 100).toFixed(1)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button onClick={handleGenerateInsights} disabled={isGenerating} className="w-full">
                        <Sparkles className="h-4 w-4 mr-2" />
                        {isGenerating ? "Generating Insights..." : "Generate AI Insights"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis</CardTitle>
                  <CardDescription>Insights and suggestions from AI analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedEntry?.ai_insights || selectedEntry?.ai_suggestions ? (
                    <div className="space-y-6">
                      {selectedEntry.ai_insights && (
                        <div>
                          <h3 className="font-semibold mb-2">Insights</h3>
                          <p className="text-sm text-muted-foreground">{selectedEntry.ai_insights}</p>
                        </div>
                      )}

                      {selectedEntry.ai_suggestions && (
                        <div>
                          <h3 className="font-semibold mb-2">Suggestions</h3>
                          <p className="text-sm text-muted-foreground">{selectedEntry.ai_suggestions}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No insights yet</h3>
                      <p className="text-muted-foreground">
                        Select an entry and generate AI insights to see analysis and suggestions.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
