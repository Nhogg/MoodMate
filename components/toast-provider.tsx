"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function ToastProvider() {
  const { currentToast, dismiss } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !currentToast) return null

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Toast variant={currentToast.variant}>
        <div>
          <ToastTitle>{currentToast.title}</ToastTitle>
          <ToastDescription>{currentToast.description}</ToastDescription>
        </div>
        <ToastClose onClick={dismiss} />
      </Toast>
    </div>,
    document.body,
  )
}
