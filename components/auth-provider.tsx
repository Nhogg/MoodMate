"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user credentials
const DEMO_CREDENTIALS = {
  username: "devpostdemo",
  password: "HPAISTUDIO",
  user: {
    id: "demo-user-id",
    email: "devpostdemo@example.com",
    user_metadata: { name: "Demo User" },
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    // Check for demo user in localStorage first
    const demoUser = localStorage.getItem("demo-user")
    if (demoUser && mounted) {
      const userData = JSON.parse(demoUser)
      setUser(userData)
      setSession({ user: userData } as Session)
      setIsLoading(false)
      return
    }

    // Check for real Supabase session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        if (event === "SIGNED_IN" && session) {
          router.push("/dashboard")
          router.refresh()
        }
        if (event === "SIGNED_OUT") {
          router.push("/")
          router.refresh()
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    // Check for demo credentials first
    if (email === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      const demoUser = DEMO_CREDENTIALS.user as User
      setUser(demoUser)
      setSession({ user: demoUser } as Session)
      localStorage.setItem("demo-user", JSON.stringify(demoUser))

      // Set cookie for middleware
      document.cookie = "demo-user=true; path=/; max-age=86400" // 24 hours

      router.push("/dashboard")
      router.refresh()
      return { error: null }
    }

    // Try Supabase authentication for real users
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    // For demo purposes, redirect to sign in
    if (email === DEMO_CREDENTIALS.username) {
      return await signIn(email, password)
    }

    // Try Supabase signup for real users
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (!error) {
      // For real users, they'll need to verify their email
      return { error: null }
    }

    return { error }
  }

  const signOut = async () => {
    // Clear demo user
    localStorage.removeItem("demo-user")
    localStorage.removeItem("demo-entries")

    // Clear demo user cookie
    document.cookie = "demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    setUser(null)
    setSession(null)

    // Also sign out from Supabase
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
