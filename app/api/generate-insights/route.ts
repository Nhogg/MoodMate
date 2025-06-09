import { type NextRequest, NextResponse } from "next/server"

// TODO: Add your Gemini API key here
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE"

export async function POST(request: NextRequest) {
  try {
    const { content, emotion, emotion_probabilities, mood } = await request.json()

    // TODO: Replace with actual Gemini API endpoint
    const prompt = `
    Analyze this journal entry and provide insights and suggestions:
    
    Content: ${content}
    User's reported mood: ${mood}
    AI-detected emotion: ${emotion}
    Emotion probabilities: ${JSON.stringify(emotion_probabilities)}
    
    Please provide:
    1. Insights about the user's emotional state and patterns
    2. Constructive suggestions for mental well-being
    3. Any notable observations about the writing
    
    Keep the response supportive, professional, and helpful.
    `

    // For now, return a mock response until you set up Gemini
    const mockResponse = {
      insights: `Based on your journal entry, I can see that you're experiencing ${emotion} emotions. Your writing shows thoughtful reflection, and the emotional analysis indicates a ${
        emotion_probabilities?.joy > 0.3 ? "generally positive" : "mixed emotional"
      } state.`,
      suggestions: `Consider practicing mindfulness techniques, maintaining regular journaling habits, and focusing on activities that bring you joy. If you're feeling overwhelmed, remember that it's okay to seek support from friends, family, or professionals.`,
    }

    // TODO: Uncomment and modify this when you have Gemini set up
    /*
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    // Parse the AI response to extract insights and suggestions
    const insights = aiResponse.split('Suggestions:')[0].replace('Insights:', '').trim();
    const suggestions = aiResponse.split('Suggestions:')[1]?.trim() || '';
    */

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error generating insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
