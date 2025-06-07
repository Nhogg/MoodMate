"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createJournalEntry } from "@/lib/journal-functions"
import { useToast } from "@/hooks/use-toast"

interface NewEntryProps {
  onEntryCreated?: () => void
}

export default function NewEntry({ onEntryCreated }: NewEntryProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mood, setMood] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Parse tags from comma-separated string
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await createJournalEntry({
        title,
        content,
        mood,
        tags: tagArray,
      })

      // Reset form
      setTitle("")
      setContent("")
      setMood("")
      setTags("")

      toast({
        title: "Success!",
        description: "Your journal entry has been saved.",
        variant: "default",
      })

      // Notify parent component to refresh entries
      if (onEntryCreated) {
        onEntryCreated()
      }
    } catch (error) {
      console.error("Error saving journal entry:", error)
      toast({
        title: "Error",
        description: "Failed to save your journal entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addPromptToContent = (prompt: string) => {
    setContent((prev) => {
      if (prev.length > 0 && !prev.endsWith("\n")) {
        return prev + "\n\n" + prompt
      }
      return prev + prompt
    })
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Journal Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your entry a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Journal Entry</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind today?"
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mood">Current Mood</Label>
              <Select value={mood} onValueChange={setMood} required>
                <SelectTrigger id="mood">
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="anxious">Anxious</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="angry">Angry</SelectItem>
                  <SelectItem value="stressed">Stressed</SelectItem>
                  <SelectItem value="grateful">Grateful</SelectItem>
                  <SelectItem value="confused">Confused</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                  <SelectItem value="peaceful">Peaceful</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., work, family, goals"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <h3 className="font-medium text-teal-800 mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" x2="12" y1="22" y2="12" />
              </svg>
              AI-Powered Prompts
            </h3>
            <p className="text-sm text-teal-700 mb-2">Need inspiration? Try one of these prompts:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto py-2 border-teal-200 hover:bg-teal-100"
                onClick={() => addPromptToContent("Today I'm feeling grateful for...")}
              >
                What are you grateful for today?
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto py-2 border-teal-200 hover:bg-teal-100"
                onClick={() => addPromptToContent("A challenge I'm currently facing is...")}
              >
                What challenges are you facing?
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto py-2 border-teal-200 hover:bg-teal-100"
                onClick={() => addPromptToContent("Something I accomplished today was...")}
              >
                What did you accomplish today?
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto py-2 border-teal-200 hover:bg-teal-100"
                onClick={() => addPromptToContent("My intention for tomorrow is...")}
              >
                What are your intentions for tomorrow?
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting || !title || !content || !mood}>
            {isSubmitting ? "Saving..." : "Save Journal Entry"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
