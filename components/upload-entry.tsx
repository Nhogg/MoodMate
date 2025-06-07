"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function UploadEntry() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    // Create preview for image files
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    clearInterval(interval)
    setUploadProgress(100)

    // Reset form after "processing"
    setTimeout(() => {
      setFile(null)
      setPreview(null)
      setNotes("")
      setIsUploading(false)
      setUploadProgress(0)

      // Show success message (in a real app, you'd use a toast or other notification)
      alert("Journal page uploaded successfully! Our AI is analyzing your entry.")
    }, 500)
  }

  return (
    <Card>
      <form onSubmit={handleUpload}>
        <CardHeader>
          <CardTitle>Upload Paper Journal Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="journal-image">Upload Journal Page</Label>
            <div className="grid gap-2">
              <Input
                id="journal-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                required
              />
              <p className="text-sm text-muted-foreground">
                Take a photo or scan of your handwritten journal page. Our AI will analyze and digitize your entry.
              </p>
            </div>
          </div>

          {preview && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Preview:</h3>
              <div className="relative rounded-md overflow-hidden border border-gray-200">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Journal page preview"
                  className="max-h-[300px] w-full object-contain"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any context or notes about this journal entry"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-medium text-amber-800 mb-2 flex items-center">
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              Tips for Best Results
            </h3>
            <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
              <li>Ensure good lighting when taking photos of your journal</li>
              <li>Keep the page flat and avoid shadows</li>
              <li>Write legibly for better AI recognition</li>
              <li>Include the entire page in the frame</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!file || isUploading}>
            {isUploading ? "Processing..." : "Upload Journal Page"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
