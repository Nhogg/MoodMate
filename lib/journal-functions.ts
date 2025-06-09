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

  if (user && !error) {
    return { user, isDemo: false }
  }

  // If no real user, check for demo user
  const demoUser = localStorage.getItem("demo-user")
  if (demoUser) {
    const userData = JSON.parse(demoUser)
    return { user: userData, isDemo: true }
  }

  // If no user at all, return null user_id for public access
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
  const { user, isDemo } = await getCurrentUser()
  const forceMode = getForceMode()

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

  // Use localStorage if in demo mode or forced
  if (isDemo || forceMode === "localStorage") {
    // For demo users, store in localStorage
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

  // For real users or forced database mode, save to Supabase
  try {
    const { data, error } = await supabase.from("entries").insert([entryData]).select().single()

    if (error) {
      console.error("Error creating journal entry in database:", error)
      throw error
    }

    return { ...data, source: "database" }
  } catch (error) {
    console.error("Failed to save to database, falling back to localStorage", error)

    // Fallback to localStorage if database fails
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
    return newEntry
  }
}

export async function getJournalEntries(limit?: number) {
  const { user, isDemo } = await getCurrentUser()
  const forceMode = getForceMode()

  // Use localStorage if in demo mode or forced
  if (isDemo || forceMode === "localStorage") {
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

  // For real users or forced database mode, get from Supabase
  try {
    let query = supabase.from("entries").select("*").order("date", { ascending: false })

    // Only filter by user_id if it's not null
    if (user.id) {
      query = query.eq("user_id", user.id)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching journal entries from database:", error)
      throw error
    }

    // Format the data for display
    return data.map((entry: any) => ({
      ...entry,
      source: "database",
      displayDate: new Date(entry.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }))
  } catch (error) {
    console.error("Failed to fetch from database, falling back to localStorage", error)

    // Fallback to localStorage if database fails
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
