import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

export type JournalEntry = {
  id: string | number
  title: string
  content: string | null
  excerpt: string
  mood: string
  tags: string[] | null
  date: string
  emotion?: string | null
  emotion_probabilities?: {
    anger: number
    disgust: number
    fear: number
    joy: number
    neutral: number
    sadness: number
  } | null
  ai_insights?: string | null
  ai_suggestions?: string | null
  user_id?: string | null
  created_at?: string
  updated_at?: string
  source?: string
}

// Emotion classification function - now uses Next.js API route
async function classifyEmotion(text: string) {
  try {
    const response = await fetch("/api/classify-emotion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error("Failed to classify emotion")
    }

    const data = await response.json()
    return {
      emotion: data.emotion,
      probabilities: data.probabilities,
      fallback: data.fallback || false,
    }
  } catch (error) {
    console.error("Error classifying emotion:", error)
    // Return neutral emotion as fallback
    return {
      emotion: "neutral",
      probabilities: {
        anger: 0.16,
        disgust: 0.16,
        fear: 0.16,
        joy: 0.16,
        neutral: 0.2,
        sadness: 0.16,
      },
      fallback: true,
    }
  }
}

// Get current user (handles both real and demo users)
async function getCurrentUser() {
  // First try to get real Supabase user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  console.log("getCurrentUser - Supabase user:", user)
  console.log("getCurrentUser - Supabase error:", error)

  if (user && !error) {
    return { user, isDemo: false }
  }

  // If no real user, check for demo user
  const demoUser = localStorage.getItem("demo-user")
  if (demoUser) {
    const userData = JSON.parse(demoUser)
    console.log("getCurrentUser - Demo user:", userData)
    return { user: userData, isDemo: true }
  }

  // If no user at all, return null user_id for public access
  console.log("getCurrentUser - No user found")
  return { user: { id: null }, isDemo: true }
}

// Sync database entries to localStorage
export async function syncDatabaseToLocalStorage() {
  try {
    console.log("Syncing database entries to localStorage...")

    // Get all entries from database
    const { data: dbEntries, error } = await supabase.from("entries").select("*").order("date", { ascending: false })

    if (error) {
      console.error("Error fetching from database:", error)
      return false
    }

    if (dbEntries && dbEntries.length > 0) {
      // Format entries for localStorage
      const formattedEntries = dbEntries.map((entry: any) => ({
        ...entry,
        source: "database-synced",
        displayDate: new Date(entry.date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }))

      // Save to localStorage
      localStorage.setItem("demo-entries", JSON.stringify(formattedEntries))
      console.log(`Synced ${formattedEntries.length} entries from database to localStorage`)
      return true
    } else {
      console.log("No entries found in database")
      return false
    }
  } catch (error) {
    console.error("Error syncing database to localStorage:", error)
    return false
  }
}

// Force using database or localStorage
export function setForceMode(mode: "database" | "localStorage" | null) {
  if (mode) {
    localStorage.setItem("journal-force-mode", mode)
  } else {
    localStorage.removeItem("journal-force-mode")
  }
}

// Get the current force mode
export function getForceMode(): "database" | "localStorage" | null {
  const mode = localStorage.getItem("journal-force-mode")
  if (mode === "database" || mode === "localStorage") {
    return mode
  }
  return null
}

export async function createJournalEntry(entry: {
  title: string
  content: string
  mood: string
  tags: string[]
}) {
  console.log("createJournalEntry called with:", entry)

  const { user, isDemo } = await getCurrentUser()
  const forceMode = getForceMode()

  console.log("User info:", { user, isDemo, forceMode })

  // Generate excerpt from content (first 150 characters)
  const excerpt = entry.content.length > 150 ? entry.content.substring(0, 150) + "..." : entry.content

  // Format current date as YYYY-MM-DD
  const currentDate = new Date().toISOString().split("T")[0]

  // Classify emotion
  const emotionData = await classifyEmotion(entry.content)

  const entryData = {
    title: entry.title,
    content: entry.content,
    excerpt: excerpt,
    mood: entry.mood,
    tags: entry.tags,
    date: currentDate,
    emotion: emotionData?.emotion || null,
    emotion_probabilities: emotionData?.probabilities || null,
    user_id: user.id,
  }

  console.log("Entry data to save:", entryData)

  // Try database first, then fall back to localStorage
  try {
    console.log("Attempting to save to Supabase database")

    const { data, error } = await supabase.from("entries").insert([entryData]).select().single()

    console.log("Supabase insert result:", { data, error })

    if (error) {
      console.error("Database error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      throw new Error(`Database error: ${error.message}`)
    }

    console.log("Successfully saved to database:", data)

    // After saving to database, sync to localStorage
    await syncDatabaseToLocalStorage()

    return { ...data, source: "database" }
  } catch (error) {
    console.error("Failed to save to database, falling back to localStorage:", error)

    // Fall back to localStorage
    const existingEntries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    const newEntry = {
      ...entryData,
      id: `fallback-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source: "localStorage-fallback",
    }
    existingEntries.unshift(newEntry)
    localStorage.setItem("demo-entries", JSON.stringify(existingEntries))

    console.log("Entry saved to localStorage as fallback")
    return newEntry
  }
}

export async function getJournalEntries(limit?: number) {
  const { user, isDemo } = await getCurrentUser()
  const forceMode = getForceMode()

  console.log("getJournalEntries - User info:", { user, isDemo, forceMode })

  // First try to sync from database to localStorage
  if (!isDemo && forceMode !== "localStorage") {
    await syncDatabaseToLocalStorage()
  }

  // Always get from localStorage (which now contains synced data)
  console.log("Getting entries from localStorage")
  const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
  const limitedEntries = limit ? entries.slice(0, limit) : entries

  return limitedEntries.map((entry: any) => ({
    ...entry,
    displayDate:
      entry.displayDate ||
      new Date(entry.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
  }))
}

export async function getJournalEntriesByDateRange(startDate: string, endDate: string) {
  const { user, isDemo } = await getCurrentUser()

  // Sync from database first
  if (!isDemo) {
    await syncDatabaseToLocalStorage()
  }

  const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
  return entries.filter((entry: any) => entry.date >= startDate && entry.date <= endDate)
}

export async function getJournalEntryById(id: string | number) {
  const { user, isDemo } = await getCurrentUser()

  // Sync from database first
  if (!isDemo) {
    await syncDatabaseToLocalStorage()
  }

  const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
  return entries.find((entry: any) => entry.id === id)
}

export async function generateAIInsights(entryId: string | number) {
  const entry = await getJournalEntryById(entryId)
  if (!entry) throw new Error("Entry not found")

  try {
    console.log("Generating AI insights for entry:", entryId)

    // Call the AI insights API route
    const response = await fetch("/api/generate-insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: entry.content || entry.excerpt,
        emotion: entry.emotion,
        emotion_probabilities: entry.emotion_probabilities,
        mood: entry.mood,
      }),
    })

    console.log("AI insights API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("AI insights API error:", errorText)
      throw new Error(`Failed to generate AI insights: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log("AI insights API response data:", data)

    // Update the entry with AI insights
    await updateJournalEntry(entryId, {
      ai_insights: data.insights,
      ai_suggestions: data.suggestions,
    })

    return data
  } catch (error) {
    console.error("Error generating AI insights:", error)
    throw error
  }
}

export async function updateJournalEntry(id: string | number, updates: Partial<JournalEntry>) {
  const { user, isDemo } = await getCurrentUser()

  // Try to update in database first
  if (!isDemo) {
    try {
      let query = supabase.from("entries").update(updates).eq("id", id)

      if (user.id) {
        query = query.eq("user_id", user.id)
      }

      const { data, error } = await query.select().single()

      if (!error) {
        // Sync updated data to localStorage
        await syncDatabaseToLocalStorage()
        return data
      }
    } catch (error) {
      console.error("Failed to update in database, updating localStorage:", error)
    }
  }

  // Update in localStorage
  const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
  const entryIndex = entries.findIndex((entry: any) => entry.id === id)
  if (entryIndex !== -1) {
    entries[entryIndex] = { ...entries[entryIndex], ...updates, updated_at: new Date().toISOString() }
    localStorage.setItem("demo-entries", JSON.stringify(entries))
    return entries[entryIndex]
  }
  throw new Error("Entry not found")
}

export async function deleteJournalEntry(id: string | number) {
  const { user, isDemo } = await getCurrentUser()

  // Try to delete from database first
  if (!isDemo) {
    try {
      let query = supabase.from("entries").delete().eq("id", id)

      if (user.id) {
        query = query.eq("user_id", user.id)
      }

      const { error } = await query

      if (!error) {
        // Sync updated data to localStorage
        await syncDatabaseToLocalStorage()
        return
      }
    } catch (error) {
      console.error("Failed to delete from database:", error)
    }
  }

  // Delete from localStorage
  const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
  const filteredEntries = entries.filter((entry: any) => entry.id !== id)
  localStorage.setItem("demo-entries", JSON.stringify(filteredEntries))
}
