"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewEntry from "@/components/new-entry"
import UploadEntry from "@/components/upload-entry"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Entry = {
  id: number
  date: string
  title: string
  excerpt: string
  mood: string
  tags: string[]
}

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchEntries() {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching entries:", error)
      } else {
        // Optional: format tags and date if needed
        const formatted = data.map((entry: any) => ({
          ...entry,
          tags: entry.tags || [],
          date: new Date(entry.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }))
        setEntries(formatted)
      }
    }

    fetchEntries()
  }, [supabase])

  return (
    <div className="flex min-h-screen flex-col">
      {/* ... header/nav stays unchanged ... */}

      <main className="flex-1">
        <div className="container py-8">
          <div className="grid gap-8">
            {/* ... streak/cards/tabs stay the same ... */}

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Entries</h2>
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
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                entry.mood === "Positive"
                                  ? "bg-green-100 text-green-800"
                                  : entry.mood === "Stressed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {entry.mood}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{entry.excerpt}</p>
                        <div className="flex gap-2 mt-2">
                          {entry.tags.map((tag) => (
                            <span key={tag} className="bg-slate-100 px-2 py-1 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground">No entries yet.</p>
                )}
                <Button variant="outline" className="w-full">
                  View All Entries
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
