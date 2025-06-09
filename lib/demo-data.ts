import type { JournalEntry } from "./journal-functions"

// Create a demo user if one doesn't exist
export function initializeDemoUser() {
  if (!localStorage.getItem("demo-user")) {
    localStorage.setItem(
      "demo-user",
      JSON.stringify({
        id: "demo-user-id",
        email: "demo@example.com",
        name: "Demo User",
      }),
    )
    console.log("Demo user initialized")
  }
}

// Initialize demo entries if none exist
export function initializeDemoEntries() {
  const existingEntries = localStorage.getItem("demo-entries")

  if (!existingEntries || JSON.parse(existingEntries).length === 0) {
    console.log("Initializing demo entries")

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const demoEntries: JournalEntry[] = [
      {
        id: "demo-1",
        title: "First day using MoodMate",
        content:
          "I decided to start journaling today to track my mental health. This app seems really helpful so far. I like how it analyzes my emotions and provides insights.",
        excerpt:
          "I decided to start journaling today to track my mental health. This app seems really helpful so far. I like how it analyzes my emotions and provides insights.",
        mood: "excited",
        tags: ["journaling", "mental health", "new start"],
        date: today.toISOString().split("T")[0],
        emotion: "joy",
        emotion_probabilities: {
          joy: 0.8,
          neutral: 0.1,
          sadness: 0.02,
          anger: 0.02,
          fear: 0.03,
          disgust: 0.03,
        },
        created_at: today.toISOString(),
        updated_at: today.toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-2",
        title: "Feeling a bit stressed",
        content:
          "Work has been quite demanding lately. I have three deadlines coming up next week and I'm not sure if I'll be able to meet all of them. Need to prioritize better.",
        excerpt:
          "Work has been quite demanding lately. I have three deadlines coming up next week and I'm not sure if I'll be able to meet all of them. Need to prioritize better.",
        mood: "stressed",
        tags: ["work", "deadlines", "stress"],
        date: yesterday.toISOString().split("T")[0],
        emotion: "fear",
        emotion_probabilities: {
          fear: 0.6,
          neutral: 0.2,
          sadness: 0.1,
          anger: 0.05,
          joy: 0.03,
          disgust: 0.02,
        },
        created_at: yesterday.toISOString(),
        updated_at: yesterday.toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
    ]

    localStorage.setItem("demo-entries", JSON.stringify(demoEntries))
    console.log("Demo entries initialized:", demoEntries)
  } else {
    console.log("Demo entries already exist")
  }
}

// Initialize all demo data
export function initializeDemoData() {
  console.log("Initializing demo data")
  initializeDemoUser()
  initializeDemoEntries()
}
