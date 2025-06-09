"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { AlertTriangle, Database, Trash2, Plus } from "lucide-react"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { user } = useAuth()

  const clearAllEntries = async () => {
    if (!confirm("Are you sure you want to delete ALL entries? This cannot be undone.")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/clear-entries", {
        method: "DELETE",
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }

  const addHistoricalEntries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/add-historical", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }

  const viewAllEntries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/view-entries")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Administration
          </CardTitle>
          <CardDescription>
            Manage your journal entries database
            {user && <div className="mt-2">Current user: {user.email || user.id}</div>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> These operations will affect your live database. Use with caution.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-3">
            <Button onClick={viewAllEntries} disabled={isLoading} variant="outline">
              <Database className="h-4 w-4 mr-2" />
              View All Entries
            </Button>

            <Button onClick={clearAllEntries} disabled={isLoading} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Entries
            </Button>

            <Button onClick={addHistoricalEntries} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Historical Data
            </Button>
          </div>

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={result.error ? "destructive" : "default"}>{result.error ? "Error" : "Success"}</Badge>
                {result.count !== undefined && <Badge variant="outline">Count: {result.count}</Badge>}
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
