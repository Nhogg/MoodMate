"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createJournalEntry } from "@/lib/journal-functions"
import { useToast } from "@/hooks/use-toast"

interface NewEntryProps {
  onEntryCreated?: () => void
}

export default function NewEntry({ onEntryCreated }: NewEntryProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mood, setMood] = useState("neutral")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !content || !mood) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("NewEntry: Submitting entry")
      setIsSubmitting(true)

      // Process tags
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      // Create entry
      const entry = await createJournalEntry({
        title,
        content,
        mood,
        tags: tagArray,
      })

      console.log("NewEntry: Entry created successfully:", entry)

      // Show success message
      toast({
        title: "Entry created",
        description: `Your journal entry "${title}" has been saved ${entry.source ? `(${entry.source})` : ""}.`,
      })

      // Reset form
      setTitle("")
      setContent("")
      setMood("neutral")
      setTags("")

      // Notify parent component
      if (onEntryCreated) {
        onEntryCreated()
      }
    } catch (error) {
      console.error("NewEntry: Error creating entry:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const moods = ["happy", "calm", "anxious", "sad", "angry", "stressed", "grateful", "confused", "excited", "neutral"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Journal Entry</CardTitle>
        <CardDescription>Record your thoughts and feelings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Textarea
              placeholder="What's on your mind today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={isSubmitting}
              >
                {moods.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <Input
                placeholder="work, family, health"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
