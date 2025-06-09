"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function DebugEntriesPage() {
  const [localEntries, setLocalEntries] = useState<any[]>([])
  const [dbEntries, setDbEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Get entries from localStorage
    const demoEntries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    setLocalEntries(demoEntries)

    // Get entries from database
    fetchDbEntries()
  }, [])

  const fetchDbEntries = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.from("entries").select("*")
      if (error) throw error
      setDbEntries(data || [])
    } catch (err) {
      console.error("Error fetching database entries:", err)
      setError(err instanceof Error ? err.message : "Unknown error fetching database entries")
    } finally {
      setIsLoading(false)
    }
  }

  const clearLocalStorage = () => {
    if (confirm("Are you sure you want to clear all entries from localStorage?")) {
      localStorage.removeItem("demo-entries")
      setLocalEntries([])
    }
  }

  const clearDatabase = async () => {
    if (!confirm("Are you sure you want to clear all entries from the database?")) {
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      // Use a more direct approach to delete all entries
      const { error } = await supabase.from("entries").delete().gt("id", 0)
      if (error) throw error
      setDbEntries([])
    } catch (err) {
      console.error("Error clearing database entries:", err)
      setError(err instanceof Error ? err.message : "Unknown error clearing database")
    } finally {
      setIsLoading(false)
    }
  }

  const fixTableStructure = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Execute each SQL statement directly
      const statements = [
        "ALTER TABLE entries ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
        "ALTER TABLE entries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
        "ALTER TABLE entries ADD COLUMN IF NOT EXISTS user_id TEXT",
      ]

      for (const sql of statements) {
        const { error } = await supabase.rpc("exec_sql", { sql })
        if (error && !error.message.includes("function") && !error.message.includes("not found")) {
          throw error
        }
      }

      // Refresh entries after fixing structure
      fetchDbEntries()
    } catch (err) {
      console.error("Error fixing table structure:", err)
      setError(err instanceof Error ? err.message : "Unknown error fixing table structure")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Debug Entries</CardTitle>
          <CardDescription>Compare entries in localStorage vs. database</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="flex justify-between mb-4">
            <div className="space-x-2">
              <Button onClick={fetchDbEntries} disabled={isLoading} variant="outline">
                Refresh
              </Button>
              <Button onClick={fixTableStructure} disabled={isLoading} variant="secondary">
                Fix Table Structure
              </Button>
            </div>
            <div className="space-x-2">
              <Button onClick={clearLocalStorage} disabled={isLoading} variant="destructive">
                Clear localStorage
              </Button>
              <Button onClick={clearDatabase} disabled={isLoading} variant="destructive">
                Clear Database
              </Button>
            </div>
          </div>

          <Tabs defaultValue="database">
            <TabsList className="mb-4">
              <TabsTrigger value="database">
                Database{" "}
                <Badge variant="outline" className="ml-2">
                  {dbEntries.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="localStorage">
                localStorage{" "}
                <Badge variant="outline" className="ml-2">
                  {localEntries.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="database">
              {isLoading ? (
                <div className="text-center py-8">Loading database entries...</div>
              ) : dbEntries.length > 0 ? (
                <div className="space-y-4">
                  {dbEntries.map((entry) => (
                    <div key={entry.id} className="border p-4 rounded-md">
                      <div className="font-bold">{entry.title}</div>
                      <div className="text-sm text-gray-500">{entry.date}</div>
                      <div className="mt-2">{entry.excerpt || entry.content}</div>
                      <div className="mt-2 flex gap-2">
                        <Badge>{entry.mood}</Badge>
                        {entry.emotion && <Badge variant="outline">{entry.emotion}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">No entries found in database</div>
              )}
            </TabsContent>

            <TabsContent value="localStorage">
              {localEntries.length > 0 ? (
                <div className="space-y-4">
                  {localEntries.map((entry) => (
                    <div key={entry.id} className="border p-4 rounded-md">
                      <div className="font-bold">{entry.title}</div>
                      <div className="text-sm text-gray-500">{entry.date}</div>
                      <div className="mt-2">{entry.excerpt || entry.content}</div>
                      <div className="mt-2 flex gap-2">
                        <Badge>{entry.mood}</Badge>
                        {entry.emotion && <Badge variant="outline">{entry.emotion}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">No entries found in localStorage</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
