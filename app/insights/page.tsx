"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { LogOut, User, Brain, ArrowLeft, Sparkles, CheckCircle } from "lucide-react"
import { getJournalEntries, generateAIInsights, type JournalEntry } from "@/lib/journal-functions"
import { useToast } from "@/hooks/use-toast"

export default function InsightsPage() {
  const { user, signOut } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)
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

      // Update the selected entry with new insights
      const updatedEntry = {
        ...selectedEntry,
        ai_insights: insights.insights,
        ai_suggestions: insights.suggestions,
      }
      setSelectedEntry(updatedEntry)

      // Update the entries list
      setEntries((prev) => prev.map((entry) => (entry.id === selectedEntry.id ? updatedEntry : entry)))

      setLastGenerated(selectedEntry.id)

      toast({
        title: "Success!",
        description: insights.fallback
          ? "AI insights generated using fallback analysis."
          : "AI insights generated successfully using Gemini.",
      })
    } catch (error) {
      console.error("Error generating insights:", error)
      toast({
        title: "Error",
        description: "Failed to generate AI insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      joy: "bg-green-100 text-green-800 border-green-200",
      anger: "bg-red-100 text-red-800 border-red-200",
      sadness: "bg-blue-100 text-blue-800 border-blue-200",
      fear: "bg-purple-100 text-purple-800 border-purple-200",
      disgust: "bg-yellow-100 text-yellow-800 border-yellow-200",
      neutral: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colors[emotion] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      happy: "bg-green-100 text-green-800 border-green-200",
      calm: "bg-blue-100 text-blue-800 border-blue-200",
      peaceful: "bg-blue-100 text-blue-800 border-blue-200",
      anxious: "bg-yellow-100 text-yellow-800 border-yellow-200",
      sad: "bg-gray-100 text-gray-800 border-gray-200",
      angry: "bg-red-100 text-red-800 border-red-200",
      stressed: "bg-red-100 text-red-800 border-red-200",
      grateful: "bg-green-100 text-green-800 border-green-200",
      confused: "bg-purple-100 text-purple-800 border-purple-200",
      excited: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return colors[mood.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200"
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
                Get AI-powered insights and suggestions based on your journal entries and emotional analysis using
                Google Gemini.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select an Entry</CardTitle>
                  <CardDescription>Choose a journal entry to analyze with AI</CardDescription>
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
                          <div className="flex items-center gap-2">
                            <span>{entry.title}</span>
                            {entry.ai_insights && <CheckCircle className="h-3 w-3 text-green-600" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{entry.displayDate}</div>
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

                      <div className="p-4 bg-slate-50 rounded-lg max-h-40 overflow-y-auto">
                        <p className="text-sm">{selectedEntry.content}</p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className={getMoodColor(selectedEntry.mood)}>
                          Mood: {selectedEntry.mood}
                        </Badge>
                        {selectedEntry.emotion && (
                          <Badge variant="outline" className={getEmotionColor(selectedEntry.emotion)}>
                            AI Emotion: {selectedEntry.emotion}
                          </Badge>
                        )}
                        {selectedEntry.ai_insights && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Analyzed
                          </Badge>
                        )}
                      </div>

                      {selectedEntry.emotion_probabilities && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Emotion Analysis Confidence</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(selectedEntry.emotion_probabilities)
                              .sort(([, a], [, b]) => b - a)
                              .map(([emotion, probability]) => (
                                <div key={emotion} className="flex justify-between items-center">
                                  <span className="capitalize">{emotion}:</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-teal-500 transition-all duration-300"
                                        style={{ width: `${probability * 100}%` }}
                                      />
                                    </div>
                                    <span className="w-12 text-right">{(probability * 100).toFixed(1)}%</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleGenerateInsights}
                        disabled={isGenerating}
                        className="w-full"
                        variant={selectedEntry.ai_insights ? "outline" : "default"}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {isGenerating
                          ? "Generating Insights..."
                          : selectedEntry.ai_insights
                            ? "Regenerate AI Insights"
                            : "Generate AI Insights"}
                      </Button>

                      {isGenerating && (
                        <div className="text-center text-sm text-muted-foreground">
                          <Brain className="h-4 w-4 animate-pulse inline mr-2" />
                          Analyzing with Google Gemini AI...
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Analysis
                    {lastGenerated === selectedEntry?.id && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Fresh
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Insights and suggestions from Google Gemini AI</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedEntry?.ai_insights || selectedEntry?.ai_suggestions ? (
                    <div className="space-y-6">
                      {selectedEntry.ai_insights && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">🔍 Insights</h3>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900 leading-relaxed">{selectedEntry.ai_insights}</p>
                          </div>
                        </div>
                      )}

                      {selectedEntry.ai_suggestions && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">💡 Suggestions</h3>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-900 leading-relaxed">{selectedEntry.ai_suggestions}</p>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        Powered by Google Gemini AI
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No insights yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Select an entry and generate AI insights to see personalized analysis and suggestions.
                      </p>
                      <div className="text-xs text-muted-foreground">Powered by Google Gemini AI</div>
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
