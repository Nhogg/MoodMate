import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function DELETE() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Delete all entries
    const { error, count } = await supabase.from("entries").delete().neq("id", "impossible-id")

    if (error) {
      console.error("Error clearing entries:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "All entries cleared successfully",
      deletedCount: count,
    })
  } catch (error) {
    console.error("Error in clear-entries:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
