import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const FALLBACK_URL = "https://pheajawbsoxxexcssszy.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZWFqYXdic294eGV4Y3Nzc3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NjUxMDksImV4cCI6MjA3NzE0MTEwOX0.1OT1A0w0zB5VK2mOVlRQoWafoOQ1H8ZNWcTpiJSF8s8";

let client: SupabaseClient<Database> | null = null;

/**
 * Lazily creates the backend client so missing env vars don't blank-screen the whole app.
 */
export function getBackendClient() {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_ANON_KEY;

  client = createClient<Database>(url, anonKey, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return client;
}
