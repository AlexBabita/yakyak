/** Client-side only. Key used in sessionStorage for current user (email). */
export const USER_KEY = "yakyak_user";

/**
 * For Supabase Auth: in Client Components use createClient() from "@/lib/supabase/client"
 * then supabase.auth.getUser() or supabase.auth.onAuthStateChange().
 * In Server Components / Route Handlers use createClient() from "@/lib/supabase/server"
 * then supabase.auth.getUser(). Middleware keeps the session cookie refreshed.
 */
