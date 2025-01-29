import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://tjbcucdewwczndkeypey.supabase.co";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";  // Replace with your actual key, preferably from environment variables

export const supabase = createClient(supabaseUrl, supabaseKey);
