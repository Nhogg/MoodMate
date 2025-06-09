export const DEMO_ENTRIES = [
  {
    id: "demo-1",
    title: "Welcome to MindfulJournal!",
    content:
      "This is your first demo entry. You can create, edit, and manage your journal entries here. The AI will help you track your mood and provide insights into your emotional patterns. I'm excited to start this journaling journey and see how it helps with my mental well-being.",
    excerpt:
      "This is your first demo entry. You can create, edit, and manage your journal entries here. The AI will help you track your mood and provide insights...",
    mood: "excited",
    emotion: "joy",
    emotion_probabilities: {
      anger: 0.05,
      disgust: 0.02,
      fear: 0.08,
      joy: 0.75,
      neutral: 0.08,
      sadness: 0.02,
    },
    tags: ["welcome", "demo", "getting-started"],
    date: new Date().toISOString().split("T")[0],
    user_id: "demo-user-id",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Morning Reflection",
    content:
      "Today I woke up feeling refreshed after a good night's sleep. I'm grateful for the peaceful morning and looking forward to the day ahead. The sun is shining through my window, and I can hear birds singing outside. It's moments like these that remind me to appreciate the simple things in life.",
    excerpt:
      "Today I woke up feeling refreshed after a good night's sleep. I'm grateful for the peaceful morning and looking forward to the day ahead...",
    mood: "grateful",
    emotion: "joy",
    emotion_probabilities: {
      anger: 0.02,
      disgust: 0.01,
      fear: 0.03,
      joy: 0.85,
      neutral: 0.08,
      sadness: 0.01,
    },
    tags: ["morning", "gratitude", "sleep"],
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
    user_id: "demo-user-id",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "demo-3",
    title: "Work Challenges",
    content:
      "Had a difficult meeting with the team today. Feeling a bit stressed about the upcoming deadline, but I know we can work through it together. The project requirements keep changing, and it's frustrating to constantly adapt. However, I'm trying to stay positive and focus on what we can control.",
    excerpt:
      "Had a difficult meeting with the team today. Feeling a bit stressed about the upcoming deadline, but I know we can work through it together...",
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
    tags: ["work", "challenges", "teamwork"],
    date: new Date(Date.now() - 172800000).toISOString().split("T")[0], // 2 days ago
    user_id: "demo-user-id",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

export function initializeDemoData() {
  const existingEntries = localStorage.getItem("demo-entries")
  if (!existingEntries) {
    localStorage.setItem("demo-entries", JSON.stringify(DEMO_ENTRIES))
  }
}
