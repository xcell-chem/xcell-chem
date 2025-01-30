import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tjbcucdewwczndkeypey.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ";  // Replace with your actual key

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true, // ✅ Force session persistence
        storage: localStorage, // ✅ Ensure session is stored
        autoRefreshToken: true, // ✅ Auto-refresh session tokens
        detectSessionInUrl: true, // ✅ Ensure OAuth detection
    }
});

// ✅ Attach Supabase to window for debugging
window.supabase = supabase;
