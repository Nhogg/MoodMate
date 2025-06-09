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

    // First, check what columns exist in the table
    const { data: tableInfo, error: tableError } = await supabase.from("entries").select("*").limit(1)

    if (tableError) {
      console.error("Error checking table structure:", tableError)
      return NextResponse.json({ error: tableError.message }, { status: 500 })
    }

    console.log("Table structure sample:", tableInfo)

    // Get the existing entries to check user_id
    const { data: existingEntries, error: fetchError } = await supabase.from("entries").select("user_id").limit(1)

    if (fetchError) {
      console.error("Error fetching existing entries:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    // Use the existing user_id if available, otherwise use null (public)
    const userId =
      existingEntries && existingEntries.length > 0 && existingEntries[0].user_id ? existingEntries[0].user_id : null

    console.log("Using user_id:", userId)

    // Create historical entries with only the columns that exist
    const historicalEntries = [
      {
        title: "New Year Reflections",
        content:
          "Starting the year with hope and determination. I want to focus more on my mental health and build better habits. Journaling feels like a good step in the right direction. I'm excited about the possibilities this year holds.",
        excerpt:
          "Starting the year with hope and determination. I want to focus more on my mental health and build better habits...",
        mood: "hopeful",
        emotion: "joy",
        emotion_probabilities: {
          anger: 0.05,
          disgust: 0.02,
          fear: 0.08,
          joy: 0.75,
          neutral: 0.08,
          sadness: 0.02,
        },
        tags: ["new-year", "goals", "mental-health"],
        date: "2024-01-01",
        user_id: userId,
      },
      {
        title: "Work Stress",
        content:
          "Had a really challenging day at work today. The deadline is approaching fast and I feel overwhelmed. My manager keeps adding more tasks and I'm struggling to keep up. I need to find better ways to manage this stress before it affects my health.",
        excerpt:
          "Had a really challenging day at work today. The deadline is approaching fast and I feel overwhelmed...",
        mood: "stressed",
        emotion: "anger",
        emotion_probabilities: {
          anger: 0.45,
          disgust: 0.15,
          fear: 0.25,
          joy: 0.05,
          neutral: 0.08,
          sadness: 0.02,
        },
        tags: ["work", "stress", "deadlines"],
        date: "2024-01-15",
        user_id: userId,
      },
      {
        title: "Weekend Relaxation",
        content:
          "Finally had a peaceful weekend. Spent time reading in the park and had coffee with friends. It's amazing how much better I feel when I take time to slow down and enjoy simple pleasures. I should do this more often.",
        excerpt: "Finally had a peaceful weekend. Spent time reading in the park and had coffee with friends...",
        mood: "peaceful",
        emotion: "joy",
        emotion_probabilities: {
          anger: 0.02,
          disgust: 0.01,
          fear: 0.03,
          joy: 0.85,
          neutral: 0.08,
          sadness: 0.01,
        },
        tags: ["weekend", "relaxation", "friends"],
        date: "2024-02-03",
        user_id: userId,
      },
      {
        title: "Feeling Grateful",
        content:
          "Today I'm reflecting on all the good things in my life. My family's health, having a job, a roof over my head. Sometimes I get so caught up in daily stress that I forget to appreciate what I have. Gratitude really does shift perspective.",
        excerpt:
          "Today I'm reflecting on all the good things in my life. My family's health, having a job, a roof over my head...",
        mood: "grateful",
        emotion: "joy",
        emotion_probabilities: {
          anger: 0.01,
          disgust: 0.01,
          fear: 0.02,
          joy: 0.9,
          neutral: 0.05,
          sadness: 0.01,
        },
        tags: ["gratitude", "family", "perspective"],
        date: "2024-02-14",
        user_id: userId,
      },
      {
        title: "Anxiety About Future",
        content:
          "Been feeling anxious about the future lately. So many uncertainties - career, relationships, where I'll be in five years. I know worrying won't change anything, but it's hard to quiet my mind. Maybe I should try meditation again.",
        excerpt:
          "Been feeling anxious about the future lately. So many uncertainties - career, relationships, where I'll be in five years...",
        mood: "anxious",
        emotion: "fear",
        emotion_probabilities: {
          anger: 0.08,
          disgust: 0.05,
          fear: 0.65,
          joy: 0.05,
          neutral: 0.15,
          sadness: 0.02,
        },
        tags: ["anxiety", "future", "uncertainty"],
        date: "2024-03-01",
        user_id: userId,
      },
    ]

    // Insert the historical entries
    const { data, error } = await supabase.from("entries").insert(historicalEntries).select()

    if (error) {
      console.error("Error adding historical entries:", error)
      return NextResponse.json(
        {
          error: error.message,
          details: error,
          sampleEntry: historicalEntries[0], // Include sample for debugging
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Historical entries added successfully",
      count: data?.length || 0,
      entries: data,
    })
  } catch (error) {
    console.error("Error in add-historical:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
