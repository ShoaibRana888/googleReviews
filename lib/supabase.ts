import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  users: {
    id: string
    email: string
    password_hash: string
    created_at: string
  }
  businesses: {
    id: string
    user_id: string
    business_name: string
    google_review_url: string
    qr_code_id: string
    created_at: string
  }
  feedback: {
    id: string
    business_id: string
    rating: number
    feedback_text: string | null
    created_at: string
  }
}
