import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fhjkihowcdqyejkyskkx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoamtpaG93Y2RxeWVqa3lza2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3Mjc1MjMsImV4cCI6MjEwMDMwMzUyM30.ROiwnKnZX-InKQDXR47rX0f4KKqqT6dn5m5i9lg9FZI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
