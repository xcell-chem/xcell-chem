import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tjbcucdewwczndkeypey.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ";

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true, // ✅ Ensures session is saved across page reloads
        storage: localStorage, // ✅ Forces storage to be localStorage
        autoRefreshToken: true, // ✅ Ensures tokens refresh automatically
        detectSessionInUrl: true, // ✅ Ensures OAuth login sessions persist
    }
});

// ✅ Attach Supabase to `window` for debugging in DevTools
window.supabase = supabase;

// ✅ Restore session immediately when the script loads
async function restoreSession() {
    const { data, error } = await supabase.auth.getSession();
    if (data?.session) {
        console.log("[DEBUG] Session restored from Supabase:", data.session);
        localStorage.setItem("supabaseSession", JSON.stringify(data.session));
    } else {
        console.warn("[DEBUG] No session found during restoration.");
    }
}

restoreSession();
