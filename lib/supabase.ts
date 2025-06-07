import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Client-side Supabase client
export const createClient = () => createClientComponentClient()

// Server-side Supabase client
export const createServerClient = () => createServerComponentClient({ cookies })

// Legacy export for backward compatibility
export const supabase = createClientComponentClient()
