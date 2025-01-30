import { createClient } from "@supabase/supabase-js";

console.log("[DEBUG] Initializing Supabase client...");

const supabaseUrl = "https://tjbcucdewwczndkeypey.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ";

// ✅ Ensure Supabase is only created once
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        storage: localStorage,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    }
});

console.log("[DEBUG] Supabase initialized:", supabase);

// ✅ Attach Supabase to `window` for debugging
window.supabase = supabase;
console.log("[DEBUG] window.supabase is now set:", window.supabase);

export { supabase };
