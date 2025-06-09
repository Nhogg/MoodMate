"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Database, HardDrive } from "lucide-react"
import { getForceMode, setForceMode } from "@/lib/journal-functions"

export default function DataSourceControl() {
  const [forceMode, setForceModeState] = useState<"database" | "localStorage" | null>(null)

  useEffect(() => {
    setForceModeState(getForceMode())
  }, [])

  const toggleMode = () => {
    const newMode = forceMode === "database" ? "localStorage" : "database"
    setForceMode(newMode)
    setForceModeState(newMode)
  }

  const resetMode = () => {
    setForceMode(null)
    setForceModeState(null)
  }

  if (!forceMode) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Auto mode</span>
        <Button onClick={toggleMode} variant="outline" size="sm" className="h-7 px-2">
          Force Source
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={forceMode === "database" ? "text-blue-600" : "text-amber-600"}>
        {forceMode === "database" ? (
          <>
            <Database className="h-3 w-3 inline mr-1" />
            Using Database
          </>
        ) : (
          <>
            <HardDrive className="h-3 w-3 inline mr-1" />
            Using localStorage
          </>
        )}
      </span>
      <Button onClick={toggleMode} variant="outline" size="sm" className="h-7 px-2">
        Switch
      </Button>
      <Button onClick={resetMode} variant="ghost" size="sm" className="h-7 px-2">
        Reset
      </Button>
    </div>
  )
}
