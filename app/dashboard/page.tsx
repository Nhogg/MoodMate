"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewEntry from "@/components/new-entry"
import UploadEntry from "@/components/upload-entry"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { LogOut, User, RefreshCw } from "lucide-react"
import { getJournalEntries, type JournalEntry } from "@/lib/journal-functions"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchEntries = async () => {
    try {
      setIsRefreshing(true)
      const fetchedEntries = await getJournalEntries(10) // Get latest 10 entries
      setEntries(fetchedEntries)
    } catch (error) {
      console.error("Error fetching entries:", error)
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
    if (user) {
      fetchEntries()
    }
  }, [user])

  const handleEntryCreated = () => {
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
    }
    return moodColors[mood.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  const getStreakData = () => {
    // Calculate streak based on entries
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const hasEntryToday = entries.some((entry) => {
      const entryDate = new Date(entry.created_at)
      return entryDate.toDateString() === today.toDateString()
    })

    const hasEntryYesterday = entries.some((entry) => {
      const entryDate = new Date(entry.created_at)
      return entryDate.toDateString() === yesterday.toDateString()
    })

    // Simple streak calculation (you can make this more sophisticated)
    let currentStreak = 0
    if (hasEntryToday) currentStreak = 1
    if (hasEntryToday && hasEntryYesterday) currentStreak = 2

    return currentStreak
  }

  const getMoodTrend = () => {
    if (entries.length === 0) return "No data"

    const recentEntries = entries.slice(0, 7) // Last 7 entries
    const positiveMoods = ["happy", "calm", "peaceful", "grateful", "excited"]
    const positiveCount = recentEntries.filter((entry) => positiveMoods.includes(entry.mood.toLowerCase())).length

    const percentage = (positiveCount / recentEntries.length) * 100

    if (percentage >= 70) return "Very Positive"
    if (percentage >= 50) return "Positive"
    if (percentage >= 30) return "Mixed"
    return "Needs Attention"
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
                <span className="text-xl font-semibold">MindfulJournal</span>
              </div>
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/dashboard" className="text-sm font-medium">
              Insights
            </Link>
            <Link href="/dashboard" className="text-sm font-medium">
              History
            </Link>
            <Link href="/dashboard" className="text-sm font-medium">
              Settings
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
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchEntries} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline">
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
                    className="h-4 w-4 mr-2"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                  View Calendar
                </Button>
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
                    {entries.length > 0 ? `Latest: ${entries[0]?.date}` : "No entries yet"}
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
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.29 7 12 12 20.71 7" />
                    <line x1="12" x2="12" y1="22" y2="12" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Coming Soon</div>
                  <p className="text-xs text-muted-foreground">AI analysis in development</p>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="new" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="new">New Entry</TabsTrigger>
                <TabsTrigger value="upload">Upload Paper Journal</TabsTrigger>
              </TabsList>
              <TabsContent value="new">
                <NewEntry onEntryCreated={handleEntryCreated} />
              </TabsContent>
              <TabsContent value="upload">
                <UploadEntry />
              </TabsContent>
            </Tabs>
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
              <div className="grid gap-4">
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <Card key={entry.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{entry.title}</CardTitle>
                            <CardDescription>{entry.date}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs capitalize ${getMoodColor(entry.mood)}`}>
                              {entry.mood}
                            </span>
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
                      </CardContent>
                    </Card>
                  ))
                ) : (
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
                )}
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
