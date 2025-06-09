import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Try to add missing columns using raw SQL
    const alterQueries = [
      "ALTER TABLE entries ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();",
      "ALTER TABLE entries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();",
      "ALTER TABLE entries ADD COLUMN IF NOT EXISTS user_id TEXT;",
      "UPDATE entries SET created_at = NOW(), updated_at = NOW() WHERE created_at IS NULL OR updated_at IS NULL;",
    ]

    const results = []

    for (const query of alterQueries) {
      try {
        const { data, error } = await supabase.rpc("exec_sql", { sql: query })
        results.push({
          query,
          success: !error,
          error: error?.message,
          data,
        })
      } catch (err) {
        results.push({
          query,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Table structure update attempted",
      results,
    })
  } catch (error) {
    console.error("Error fixing table:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
