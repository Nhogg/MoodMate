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

export async function createJournalEntry(entry: {
  title: string
  content: string
  mood: string
  tags: string[]
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Generate excerpt from content (first 150 characters)
  const excerpt = entry.content.length > 150 ? entry.content.substring(0, 150) + "..." : entry.content

  // Format current date as YYYY-MM-DD
  const currentDate = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("entries")
    .insert([
      {
        title: entry.title,
        excerpt: excerpt,
        mood: entry.mood,
        tags: entry.tags,
        date: currentDate,
        user_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating journal entry:", error)
    throw error
  }

  return data
}

export async function getJournalEntries(limit?: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("entries").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting journal entry:", error)
    throw error
  }
}
