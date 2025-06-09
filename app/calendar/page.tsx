"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { LogOut, User, CalendarIcon, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { getJournalEntriesByDateRange, type JournalEntry } from "@/lib/journal-functions"
import { useToast } from "@/hooks/use-toast"

export default function CalendarPage() {
  const { user, signOut } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchEntriesForMonth()
    }
  }, [user, currentDate])

  const fetchEntriesForMonth = async () => {
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const startDate = new Date(year, month, 1).toISOString().split("T")[0]
      const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0]

      const fetchedEntries = await getJournalEntriesByDateRange(startDate, endDate)
      setEntries(fetchedEntries)
    } catch (error) {
      console.error("Error fetching entries:", error)
      toast({
        title: "Error",
        description: "Failed to load calendar entries.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getEntriesForDate = (date: string) => {
    return entries.filter((entry) => entry.date === date)
  }

  const getDominantMoodForDate = (date: string) => {
    const dayEntries = getEntriesForDate(date)
    if (dayEntries.length === 0) return null

    // Get the most recent entry's emotion or mood
    const latestEntry = dayEntries[0]
    return latestEntry.emotion || latestEntry.mood
  }

  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      joy: "bg-green-100 text-green-800",
      happy: "bg-green-100 text-green-800",
      anger: "bg-red-100 text-red-800",
      angry: "bg-red-100 text-red-800",
      sadness: "bg-blue-100 text-blue-800",
      sad: "bg-blue-100 text-blue-800",
      fear: "bg-purple-100 text-purple-800",
      anxious: "bg-purple-100 text-purple-800",
      disgust: "bg-yellow-100 text-yellow-800",
      neutral: "bg-gray-100 text-gray-800",
      calm: "bg-blue-100 text-blue-800",
      grateful: "bg-green-100 text-green-800",
      excited: "bg-orange-100 text-orange-800",
      stressed: "bg-red-100 text-red-800",
    }
    return colors[mood.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatDate = (day: number) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    return new Date(year, month, day).toISOString().split("T")[0]
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : []

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
              <CalendarIcon className="h-6 w-6 text-teal-600" />
              <span className="text-xl font-semibold">Journal Calendar</span>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/insights" className="text-sm font-medium">
              Insights
            </Link>
            <Link href="/calendar" className="text-sm font-medium text-teal-600">
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
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Click on a date to view entries for that day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {getDaysInMonth().map((day, index) => {
                      if (day === null) {
                        return <div key={index} className="p-2" />
                      }

                      const dateStr = formatDate(day)
                      const dayEntries = getEntriesForDate(dateStr)
                      const dominantMood = getDominantMoodForDate(dateStr)
                      const isSelected = selectedDate === dateStr
                      const isToday = dateStr === new Date().toISOString().split("T")[0]

                      return (
                        <Button
                          key={day}
                          variant={isSelected ? "default" : "ghost"}
                          className={`h-16 p-2 flex flex-col items-center justify-center relative ${
                            isToday ? "ring-2 ring-teal-500" : ""
                          }`}
                          onClick={() => setSelectedDate(dateStr)}
                        >
                          <span className="text-sm font-medium">{day}</span>
                          {dayEntries.length > 0 && (
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs">{dayEntries.length}</span>
                              {dominantMood && (
                                <div className={`w-2 h-2 rounded-full ${getMoodColor(dominantMood).split(" ")[0]}`} />
                              )}
                            </div>
                          )}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedDate
                      ? new Date(selectedDate).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Select a Date"}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateEntries.length > 0
                      ? `${selectedDateEntries.length} ${selectedDateEntries.length === 1 ? "entry" : "entries"}`
                      : "No entries for this date"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDateEntries.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateEntries.map((entry) => (
                        <div key={entry.id} className="p-4 border rounded-lg">
                          <h3 className="font-semibold">{entry.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{entry.excerpt}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getMoodColor(entry.mood)}`}>
                              {entry.mood}
                            </span>
                            {entry.emotion && (
                              <span className={`px-2 py-1 text-xs rounded-full ${getMoodColor(entry.emotion)}`}>
                                AI: {entry.emotion}
                              </span>
                            )}
                          </div>
                          <Link href={`/insights?entry=${entry.id}`}>
                            <Button variant="outline" size="sm" className="mt-2">
                              View Insights
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : selectedDate ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No journal entries for this date</p>
                      <Link href="/dashboard">
                        <Button className="mt-4">Create Entry</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Click on a date to view entries</p>
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
