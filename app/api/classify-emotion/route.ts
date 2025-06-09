import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Call your local emotion classification API
    const response = await fetch("http://127.0.0.1:8000/predict/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error(`Emotion API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      emotion: data.emotion,
      probabilities: data.probabilities,
    })
  } catch (error) {
    console.error("Error calling emotion classification API:", error)

    // Return a fallback response if the emotion API is not available
    return NextResponse.json({
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
    })
  }
}
