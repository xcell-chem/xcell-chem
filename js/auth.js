import { supabase } from "./supabaseClient.js";

console.log("[DEBUG] Auth module loaded.");
console.log("[DEBUG] Supabase instance in auth.js:", supabase);

// ✅ Function to check login status (ENSURE THIS IS ONLY DEFINED ONCE)
async function checkLoginStatus() {
    console.log("[DEBUG] Checking login status...");
    try {
        // Force Supabase to detect the stored session
        await supabase.auth.getSession();  
        const { data, error } = await supabase.auth.refreshSession();  

        if (error || !data.session) {
            console.warn("[DEBUG] No active session found.");
            return false;
        }

        console.log("[DEBUG] User is logged in:", data.session.user);
        return true;
    } catch (err) {
        console.error("[DEBUG] Unexpected error:", err);
        return false;
    }
}

supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("[DEBUG] 🔄 Auth state changed:", event, session);
    
    if (session) {
        console.log("[DEBUG] ✅ Storing session manually in localStorage:", session);
        localStorage.setItem("supabase.auth.token", JSON.stringify(session));

        console.log("[DEBUG] 🔄 Forcing Supabase to use session...");
        await supabase.auth.setSession(session);

        // Verify that it's actually being stored
        console.log("[DEBUG] 🔍 Stored session in localStorage:", localStorage.getItem("supabase.auth.token"));
    } else {
        console.warn("[DEBUG] ⚠️ Session is NULL. Removing from localStorage.");
        localStorage.removeItem("supabase.auth.token");
    }
});




// ✅ Function to open login popup
async function openLoginPopup() {
    console.log("[DEBUG] 🔄 Attempting to open login popup...");
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { 
                redirectTo: "https://shinyflake.co.uk",
                skipBrowserRedirect: false
            }
        });

        if (error) {
            console.error("[DEBUG] ❌ OAuth login error:", error);
            alert("Login failed. Please try again.");
        } else {
            console.log("[DEBUG] ✅ OAuth login initiated successfully:", data);
        }
    } catch (err) {
        console.error("[DEBUG] ❌ Unexpected error during OAuth login:", err);
    }
}


// ✅ Ensure there is ONLY ONE export statement
export { checkLoginStatus, openLoginPopup };
