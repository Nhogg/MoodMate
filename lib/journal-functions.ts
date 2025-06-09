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

  // Always try localStorage first for demo users or if forced
  if (isDemo || forceMode === "localStorage") {
    console.log("Saving to localStorage (demo mode or forced)")
    const existingEntries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    const newEntry = {
      ...entryData,
      id: `demo-${Date.now()}`, // Generate a simple ID for demo
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source: "localStorage",
    }
    existingEntries.unshift(newEntry)
    localStorage.setItem("demo-entries", JSON.stringify(existingEntries))
    return newEntry
  }

  // For real users, try database first
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

      // If it's a specific database error, provide more context
      if (error.code === "42P01") {
        throw new Error("Database table 'entries' does not exist. Please run the database setup scripts.")
      } else if (error.code === "42703") {
        throw new Error("Database column missing. Please run the database migration scripts.")
      } else if (error.code === "23505") {
        throw new Error("Duplicate entry detected. Please try again.")
      } else {
        throw new Error(`Database error: ${error.message}`)
      }
    }

    console.log("Successfully saved to database:", data)
    return { ...data, source: "database" }
  } catch (error) {
    console.error("Failed to save to database, falling back to localStorage:", error)

    // Always fall back to localStorage if database fails
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

    // Still return the entry, but log that we used fallback
    console.log("Entry saved to localStorage as fallback")
    return newEntry
  }
}

export async function getJournalEntries(limit?: number) {
  const { user, isDemo } = await getCurrentUser()
  const forceMode = getForceMode()

  console.log("getJournalEntries - User info:", { user, isDemo, forceMode })

  // Use localStorage if in demo mode or forced (but NOT if forced to database)
  if (isDemo || forceMode === "localStorage") {
    console.log("Getting entries from localStorage")
    // For demo users, get from localStorage
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    const limitedEntries = limit ? entries.slice(0, limit) : entries

    return limitedEntries.map((entry: any) => ({
      ...entry,
      source: "localStorage",
      displayDate: new Date(entry.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }))
  }

  // For real users, try database first
  try {
    console.log("Getting entries from Supabase database")

    let query = supabase.from("entries").select("*").order("date", { ascending: false })

    // Only filter by user_id if it's not null
    if (user.id) {
      query = query.eq("user_id", user.id)
      console.log("Filtering by user_id:", user.id)
    } else {
      console.log("No user_id filter applied")
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    console.log("Supabase query result:", { data, error })

    if (error) {
      console.error("Error fetching journal entries from database:", error)
      throw error
    }

    // Format the data for display
    const formattedData = data.map((entry: any) => ({
      ...entry,
      source: "database",
      displayDate: new Date(entry.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }))

    console.log("Formatted database entries:", formattedData)
    return formattedData
  } catch (error) {
    console.error("Failed to fetch from database, falling back to localStorage:", error)

    // Always fall back to localStorage if database fails
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    const limitedEntries = limit ? entries.slice(0, limit) : entries

    return limitedEntries.map((entry: any) => ({
      ...entry,
      source: "localStorage-fallback",
      displayDate: new Date(entry.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }))
  }
}

export async function getJournalEntriesByDateRange(startDate: string, endDate: string) {
  const { user, isDemo } = await getCurrentUser()
  const forceMode = getForceMode()

  if (isDemo || forceMode === "localStorage") {
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    return entries.filter((entry: any) => entry.date >= startDate && entry.date <= endDate)
  }

  try {
    let query = supabase
      .from("entries")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false })

    // Only filter by user_id if it's not null
    if (user.id) {
      query = query.eq("user_id", user.id)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching entries by date range:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to fetch date range from database, falling back to localStorage:", error)
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    return entries.filter((entry: any) => entry.date >= startDate && entry.date <= endDate)
  }
}

export async function getJournalEntryById(id: string | number) {
  const { user, isDemo } = await getCurrentUser()
  const forceMode = getForceMode()

  if (isDemo || forceMode === "localStorage") {
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    return entries.find((entry: any) => entry.id === id)
  }

  try {
    let query = supabase.from("entries").select("*").eq("id", id)

    // Only filter by user_id if it's not null
    if (user.id) {
      query = query.eq("user_id", user.id)
    }

    const { data, error } = await query.single()

    if (error) {
      console.error("Error fetching entry by ID:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to fetch entry by ID from database, falling back to localStorage:", error)
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    return entries.find((entry: any) => entry.id === id)
  }
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
        content: entry.content || entry.excerpt, // Use excerpt if content is null
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
  const forceMode = getForceMode()

  if (isDemo || forceMode === "localStorage") {
    // For demo users, update in localStorage
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    const entryIndex = entries.findIndex((entry: any) => entry.id === id)
    if (entryIndex !== -1) {
      entries[entryIndex] = { ...entries[entryIndex], ...updates, updated_at: new Date().toISOString() }
      localStorage.setItem("demo-entries", JSON.stringify(entries))
      return entries[entryIndex]
    }
    throw new Error("Entry not found")
  }

  try {
    // For real users, update in Supabase
    let query = supabase.from("entries").update(updates).eq("id", id)

    // Only filter by user_id if it's not null
    if (user.id) {
      query = query.eq("user_id", user.id)
    }

    const { data, error } = await query.select().single()

    if (error) {
      console.error("Error updating journal entry:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to update entry in database, falling back to localStorage:", error)
    // Fall back to localStorage
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    const entryIndex = entries.findIndex((entry: any) => entry.id === id)
    if (entryIndex !== -1) {
      entries[entryIndex] = { ...entries[entryIndex], ...updates, updated_at: new Date().toISOString() }
      localStorage.setItem("demo-entries", JSON.stringify(entries))
      return entries[entryIndex]
    }
    throw new Error("Entry not found")
  }
}

export async function deleteJournalEntry(id: string | number) {
  const { user, isDemo } = await getCurrentUser()
  const forceMode = getForceMode()

  if (isDemo || forceMode === "localStorage") {
    // For demo users, remove from localStorage
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    const filteredEntries = entries.filter((entry: any) => entry.id !== id)
    localStorage.setItem("demo-entries", JSON.stringify(filteredEntries))
    return
  }

  try {
    // For real users, delete from Supabase
    let query = supabase.from("entries").delete().eq("id", id)

    // Only filter by user_id if it's not null
    if (user.id) {
      query = query.eq("user_id", user.id)
    }

    const { error } = await query

    if (error) {
      console.error("Error deleting journal entry:", error)
      throw error
    }
  } catch (error) {
    console.error("Failed to delete entry from database:", error)
    // For delete operations, we don't fall back to localStorage
    throw error
  }
}
