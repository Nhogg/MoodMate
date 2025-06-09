import { createClient } from "@supabase/supabase-js"

export async function checkAndCreateEntriesTable() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials")
      return { success: false, error: "Missing Supabase credentials" }
    }

    // Use service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if the entries table exists
    const { error: checkError } = await supabase.from("entries").select("id").limit(1)

    if (checkError && checkError.code === "42P01") {
      // Table doesn't exist
      // Create the entries table
      const { error: createError } = await supabase.rpc("create_entries_table")

      if (createError) {
        console.error("Error creating entries table:", createError)
        return { success: false, error: createError }
      }

      return { success: true, message: "Entries table created successfully" }
    }

    return { success: true, message: "Entries table already exists" }
  } catch (error) {
    console.error("Error checking database:", error)
    return { success: false, error }
  }
}
