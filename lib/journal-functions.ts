import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

export type JournalEntry = {
  id: string
  title: string
  excerpt: string
  mood: string
  tags: string[]
  date: string
  user_id?: string
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

  throw new Error("User not authenticated")
}

export async function createJournalEntry(entry: {
  title: string
  content: string
  mood: string
  tags: string[]
}) {
  const { user, isDemo } = await getCurrentUser()

  // Generate excerpt from content (first 150 characters)
  const excerpt = entry.content.length > 150 ? entry.content.substring(0, 150) + "..." : entry.content

  // Format current date as YYYY-MM-DD
  const currentDate = new Date().toISOString().split("T")[0]

  const entryData = {
    title: entry.title,
    excerpt: excerpt,
    mood: entry.mood,
    tags: entry.tags,
    date: currentDate,
    user_id: user.id,
  }

  if (isDemo) {
    // For demo users, store in localStorage
    const existingEntries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    const newEntry = {
      ...entryData,
      id: `demo-${Date.now()}`, // Generate a simple ID for demo
    }
    existingEntries.unshift(newEntry)
    localStorage.setItem("demo-entries", JSON.stringify(existingEntries))
    return newEntry
  }

  // For real users, save to Supabase
  const { data, error } = await supabase.from("entries").insert([entryData]).select().single()

  if (error) {
    console.error("Error creating journal entry:", error)
    throw error
  }

  return data
}

export async function getJournalEntries(limit?: number) {
  const { user, isDemo } = await getCurrentUser()

  if (isDemo) {
    // For demo users, get from localStorage
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    const limitedEntries = limit ? entries.slice(0, limit) : entries

    return limitedEntries.map((entry: any) => ({
      ...entry,
      displayDate: new Date(entry.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }))
  }

  // For real users, get from Supabase
  let query = supabase.from("entries").select("*").eq("user_id", user.id).order("date", { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching journal entries:", error)
    throw error
  }

  // Format the data for display
  return data.map((entry: any) => ({
    ...entry,
    displayDate: new Date(entry.date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }))
}

export async function updateJournalEntry(id: string, updates: Partial<JournalEntry>) {
  const { user, isDemo } = await getCurrentUser()

  if (isDemo) {
    // For demo users, update in localStorage
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    const entryIndex = entries.findIndex((entry: any) => entry.id === id)
    if (entryIndex !== -1) {
      entries[entryIndex] = { ...entries[entryIndex], ...updates }
      localStorage.setItem("demo-entries", JSON.stringify(entries))
      return entries[entryIndex]
    }
    throw new Error("Entry not found")
  }

  // For real users, update in Supabase
  const { data, error } = await supabase
    .from("entries")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating journal entry:", error)
    throw error
  }

  return data
}

export async function deleteJournalEntry(id: string) {
  const { user, isDemo } = await getCurrentUser()

  if (isDemo) {
    // For demo users, remove from localStorage
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    const filteredEntries = entries.filter((entry: any) => entry.id !== id)
    localStorage.setItem("demo-entries", JSON.stringify(filteredEntries))
    return
  }

  // For real users, delete from Supabase
  const { error } = await supabase.from("entries").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting journal entry:", error)
    throw error
  }
}
