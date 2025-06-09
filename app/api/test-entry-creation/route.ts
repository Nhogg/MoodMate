import { NextResponse } from "next/server"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  try {
    const { title, content, mood } = await request.json()

    const supabase = createClientComponentClient()

    // Test the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log("User data:", user)
    console.log("User error:", userError)

    // Create test entry data
    const entryData = {
      title: title || "Test Entry",
      content: content || "This is a test entry to debug database saving.",
      excerpt: "This is a test entry to debug database saving.",
      mood: mood || "happy",
      tags: ["test"],
      date: new Date().toISOString().split("T")[0],
      user_id: user?.id || null,
      emotion: "joy",
      emotion_probabilities: {
        anger: 0.1,
        disgust: 0.1,
        fear: 0.1,
        joy: 0.6,
        neutral: 0.1,
        sadness: 0.0,
      },
    }

    console.log("Attempting to insert:", entryData)

    // Try to insert the entry
    const { data, error } = await supabase.from("entries").insert([entryData]).select().single()

    console.log("Insert result:", { data, error })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          user: user ? { id: user.id, email: user.email } : null,
          entryData,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      data,
      user: user ? { id: user.id, email: user.email } : null,
      entryData,
    })
  } catch (error) {
    console.error("Error in test-entry-creation:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
