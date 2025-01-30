
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = "https://tjbcucdewwczndkeypey.supabase.co";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";  // Replace with your actual key

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true, // ✅ Ensures session is stored
        storage: localStorage, // ✅ Explicitly use localStorage
        autoRefreshToken: true, // ✅ Automatically refreshes expired tokens
        detectSessionInUrl: true, // ✅ Ensures OAuth sessions are detected
    }
});
