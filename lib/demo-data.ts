export const DEMO_ENTRIES = [
  {
    id: "demo-1",
    title: "Welcome to MindfulJournal!",
    excerpt:
      "This is your first demo entry. You can create, edit, and manage your journal entries here. The AI will help you track your mood and provide insights...",
    mood: "excited",
    tags: ["welcome", "demo", "getting-started"],
    date: new Date().toISOString().split("T")[0],
    user_id: "demo-user-id",
  },
  {
    id: "demo-2",
    title: "Morning Reflection",
    excerpt:
      "Today I woke up feeling refreshed after a good night's sleep. I'm grateful for the peaceful morning and looking forward to the day ahead...",
    mood: "grateful",
    tags: ["morning", "gratitude", "sleep"],
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
    user_id: "demo-user-id",
  },
  {
    id: "demo-3",
    title: "Work Challenges",
    excerpt:
      "Had a difficult meeting with the team today. Feeling a bit stressed about the upcoming deadline, but I know we can work through it together...",
    mood: "stressed",
    tags: ["work", "challenges", "teamwork"],
    date: new Date(Date.now() - 172800000).toISOString().split("T")[0], // 2 days ago
    user_id: "demo-user-id",
  },
]

export function initializeDemoData() {
  const existingEntries = localStorage.getItem("demo-entries")
  if (!existingEntries) {
    localStorage.setItem("demo-entries", JSON.stringify(DEMO_ENTRIES))
  }
}
