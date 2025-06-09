"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import NewEntry from "@/components/new-entry"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { LogOut, User, RefreshCw, Brain, Calendar } from "lucide-react"
import { getJournalEntries, syncDatabaseToLocalStorage, type JournalEntry } from "@/lib/journal-functions"
import { useToast } from "@/hooks/use-toast"
import { initializeDemoData } from "@/lib/demo-data"

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [entries, setEntries] = useState<(JournalEntry & { displayDate?: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchEntries = async () => {
    try {
      setIsRefreshing(true)
      setError(null)

      console.log("Dashboard: Fetching entries, user:", user)

      // Initialize demo data if it's a demo user
      if (user?.id === "demo-user-id") {
        console.log("Dashboard: Initializing demo data")
        initializeDemoData()
      } else {
        // For real users, sync from database to localStorage
        console.log("Dashboard: Syncing database to localStorage")
        await syncDatabaseToLocalStorage()
      }

      const fetchedEntries = await getJournalEntries(10) // Get latest 10 entries
      console.log("Dashboard: Fetched entries:", fetchedEntries)
      setEntries(fetchedEntries)
    } catch (fetchError) {
      console.error("Dashboard: Error fetching entries:", fetchError)
      setError(fetchError instanceof Error ? fetchError.message : "Unknown error fetching entries")
      toast({
        title: "Error",
        description: "Failed to load journal entries. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    console.log("Dashboard: useEffect triggered, user:", user)
    if (user) {
      fetchEntries()
    } else {
      console.log("Dashboard: No user available yet")
      setIsLoading(false)
    }
  }, [user])

  const handleEntryCreated = () => {
    console.log("Dashboard: Entry created, refreshing entries")
    fetchEntries() // Refresh entries when a new one is created
  }

  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: string } = {
      happy: "bg-green-100 text-green-800",
      calm: "bg-blue-100 text-blue-800",
      peaceful: "bg-blue-100 text-blue-800",
      anxious: "bg-yellow-100 text-yellow-800",
      sad: "bg-gray-100 text-gray-800",
      angry: "bg-red-100 text-red-800",
      stressed: "bg-red-100 text-red-800",
      grateful: "bg-green-100 text-green-800",
      confused: "bg-purple-100 text-purple-800",
      excited: "bg-orange-100 text-orange-800",
      joy: "bg-green-100 text-green-800",
      anger: "bg-red-100 text-red-800",
      sadness: "bg-blue-100 text-blue-800",
      fear: "bg-purple-100 text-purple-800",
      disgust: "bg-yellow-100 text-yellow-800",
      neutral: "bg-gray-100 text-gray-800",
    }
    return moodColors[mood?.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  const getStreakData = () => {
    if (entries.length === 0) return 0

    // Calculate streak based on entries
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    const hasEntryToday = entries.some((entry) => entry.date === today)
    const hasEntryYesterday = entries.some((entry) => entry.date === yesterdayStr)

    // Simple streak calculation
    let currentStreak = 0
    if (hasEntryToday) currentStreak = 1
    if (hasEntryToday && hasEntryYesterday) currentStreak = 2

    return currentStreak
  }

  const getMoodTrend = () => {
    if (entries.length === 0) return "No data"

    const recentEntries = entries.slice(0, 7) // Last 7 entries
    const positiveMoods = ["happy", "calm", "peaceful", "grateful", "excited", "joy"]
    const positiveCount = recentEntries.filter((entry) => {
      const moodToCheck = (entry.emotion || entry.mood || "").toLowerCase()
      return positiveMoods.includes(moodToCheck)
    }).length

    const percentage = (positiveCount / recentEntries.length) * 100

    if (percentage >= 70) return "Very Positive"
    if (percentage >= 50) return "Positive"
    if (percentage >= 30) return "Mixed"
    return "Needs Attention"
  }

  const getAIInsightsCount = () => {
    return entries.filter((entry) => entry.ai_insights || entry.ai_suggestions).length
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
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
                <span className="text-xl font-semibold">MoodMate</span>
              </div>
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-teal-600">
              Dashboard
            </Link>
            <Link href="/insights" className="text-sm font-medium hover:text-teal-600">
              Insights
            </Link>
            <Link href="/calendar" className="text-sm font-medium hover:text-teal-600">
              Calendar
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="grid gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.email || "devpostdemo"}! Track your journaling progress and mental well-being.
                  {user?.id === "demo-user-id" && (
                    <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Demo Mode</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchEntries} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Link href="/calendar">
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
                <Link href="/insights">
                  <Button variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Insights
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entries.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {entries.length > 0 ? `Latest: ${entries[0]?.displayDate}` : "No entries yet"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
                    <path d="m13 12-3 5h4l-3 5" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getStreakData()} days</div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" x2="9.01" y1="9" y2="9" />
                    <line x1="15" x2="15.01" y1="9" y2="9" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getMoodTrend()}</div>
                  <p className="text-xs text-muted-foreground">Based on recent entries</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getAIInsightsCount()}</div>
                  <p className="text-xs text-muted-foreground">Entries with AI analysis</p>
                </CardContent>
              </Card>
            </div>
            <NewEntry onEntryCreated={handleEntryCreated} />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Recent Entries</h2>
                {isLoading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
                  <strong>Error loading entries:</strong> {error}
                  <div className="mt-2">
                    <Button variant="outline" size="sm" onClick={fetchEntries}>
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <Card key={entry.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{entry.title}</CardTitle>
                            <CardDescription>{entry.displayDate}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs capitalize ${getMoodColor(entry.mood)}`}>
                              {entry.mood}
                            </span>
                            {entry.emotion && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs capitalize ${getMoodColor(entry.emotion)}`}
                              >
                                AI: {entry.emotion}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{entry.excerpt}</p>
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {entry.tags.map((tag, index) => (
                              <span key={index} className="bg-slate-100 px-2 py-1 rounded-full text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {entry.emotion_probabilities && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">
                              Emotion confidence:{" "}
                              {(Math.max(...Object.values(entry.emotion_probabilities)) * 100).toFixed(1)}%
                            </p>
                          </div>
                        )}
                        {entry.source && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Source: {entry.source}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : !isLoading ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-12 w-12 text-muted-foreground mb-4"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" x2="8" y1="13" y2="13" />
                        <line x1="16" x2="8" y1="17" y2="17" />
                        <line x1="10" x2="8" y1="9" y2="9" />
                      </svg>
                      <h3 className="text-lg font-semibold mb-2">No journal entries yet</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Start your journaling journey by creating your first entry above.
                      </p>
                    </CardContent>
                  </Card>
                ) : null}
                {entries.length > 0 && (
                  <Button variant="outline" className="w-full">
                    View All Entries ({entries.length})
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
