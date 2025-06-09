"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createJournalEntry } from "@/lib/journal-functions"
import { useAuth } from "@/components/auth-provider"

export default function DebugSupabasePage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [entryResult, setEntryResult] = useState<any>(null)
  const { user } = useAuth()

  const testSupabaseConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-supabase")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }

  const createTestEntry = async () => {
    setIsLoading(true)
    try {
      const entry = await createJournalEntry({
        title: "Test Entry " + new Date().toISOString(),
        content: "This is a test entry created to debug Supabase integration.",
        mood: "happy",
        tags: ["test", "debug"],
      })
      setEntryResult({
        success: true,
        entry,
      })
    } catch (error) {
      console.error("Error creating test entry:", error)
      setEntryResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Supabase Connection Debug</CardTitle>
          <CardDescription>Test your Supabase integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testSupabaseConnection} disabled={isLoading}>
              Test Supabase Connection
            </Button>
          </div>

          {testResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={testResult.error ? "destructive" : "default"}>
                  {testResult.error ? "Error" : "Success"}
                </Badge>
              </div>

              <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Test Entry</CardTitle>
          <CardDescription>
            Create a test journal entry to debug the save functionality
            {user && <div className="mt-2">Current user: {user.email || user.id}</div>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={createTestEntry} disabled={isLoading}>
              Create Test Entry
            </Button>
          </div>

          {entryResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={entryResult.success ? "default" : "destructive"}>
                  {entryResult.success ? "Success" : "Error"}
                </Badge>
              </div>

              <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                {JSON.stringify(entryResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
