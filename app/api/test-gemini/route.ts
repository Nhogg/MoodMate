import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY not found in environment variables",
          envKeys: Object.keys(process.env).filter((key) => key.includes("GEMINI")),
        },
        { status: 500 },
      )
    }

    // Test with a simple prompt
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Hello! Please respond with 'Gemini API is working correctly!' to test the connection.",
              },
            ],
          },
        ],
      }),
    })

    const responseText = await response.text()

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      apiKeyPrefix: GEMINI_API_KEY.substring(0, 10) + "...",
      success: response.ok,
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
