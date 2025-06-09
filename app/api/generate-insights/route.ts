import { type NextRequest, NextResponse } from "next/server"

// Add your Gemini API key here
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { content, emotion, emotion_probabilities, mood } = await request.json()

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Create a detailed prompt for Gemini
    const prompt = `
You are a compassionate AI mental health assistant analyzing a journal entry. Please provide thoughtful insights and constructive suggestions.

JOURNAL ENTRY:
"${content}"

EMOTIONAL DATA:
- User's self-reported mood: ${mood}
- AI-detected primary emotion: ${emotion}
- Emotion analysis breakdown: ${JSON.stringify(emotion_probabilities, null, 2)}

Please analyze this journal entry and provide:

1. INSIGHTS (2-3 sentences): 
   - Emotional patterns you notice
   - What the writing reveals about their mental state
   - Any positive aspects or concerning patterns

2. SUGGESTIONS (2-3 actionable recommendations):
   - Specific mental health practices
   - Coping strategies relevant to their emotional state
   - Activities or mindset shifts that could help

Keep your response supportive, professional, and encouraging. Focus on mental wellness and personal growth.

Format your response as:
INSIGHTS: [your insights here]
SUGGESTIONS: [your suggestions here]
`

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API error:", errorData)
      throw new Error(`Gemini API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Invalid response from Gemini API")
    }

    const aiResponse = data.candidates[0].content.parts[0].text

    // Parse the AI response to extract insights and suggestions
    const insightsMatch = aiResponse.match(/INSIGHTS:\s*(.*?)(?=SUGGESTIONS:|$)/s)
    const suggestionsMatch = aiResponse.match(/SUGGESTIONS:\s*(.*?)$/s)

    const insights = insightsMatch
      ? insightsMatch[1].trim()
      : aiResponse.split("\n")[0] || "Unable to generate insights at this time."
    const suggestions = suggestionsMatch
      ? suggestionsMatch[1].trim()
      : "Continue journaling regularly to track your emotional patterns and consider speaking with a mental health professional if you need additional support."

    return NextResponse.json({
      insights,
      suggestions,
      raw_response: aiResponse, // Include full response for debugging
    })
  } catch (error) {
    console.error("Error generating insights:", error)

    // Provide a meaningful fallback response
    const { emotion, mood } = await request.json()
    const fallbackInsights = `Based on your journal entry expressing ${emotion} emotions and ${mood} mood, I can see you're processing your experiences thoughtfully. Your willingness to reflect through writing shows emotional awareness and a commitment to understanding your mental state.`

    const fallbackSuggestions = `Consider continuing your journaling practice as it's a valuable tool for emotional processing. If you're experiencing difficult emotions, try mindfulness techniques, gentle physical activity, or reaching out to supportive friends or family. Remember that seeking professional support is always a healthy choice when needed.`

    return NextResponse.json({
      insights: fallbackInsights,
      suggestions: fallbackSuggestions,
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}
