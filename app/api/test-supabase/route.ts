import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Create a Supabase client with direct environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Missing Supabase credentials",
          envVars: {
            hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            envKeys: Object.keys(process.env).filter((key) => key.includes("SUPABASE") || key.includes("POSTGRES")),
          },
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test the connection by trying to get the current user
    const { data, error } = await supabase.auth.getUser()

    // Test if the entries table exists
    const { data: tableData, error: tableError } = await supabase.from("entries").select("*").limit(1)

    return NextResponse.json({
      connection: "Success",
      auth: { data, error: error?.message },
      table: {
        exists: !tableError,
        error: tableError?.message,
        data: tableData,
      },
      config: {
        supabaseUrl: supabaseUrl.substring(0, 10) + "...",
        supabaseKeyPrefix: supabaseKey.substring(0, 5) + "...",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
