import { supabase } from "./supabaseClient.js";

console.log("[DEBUG] Auth module loaded.");
console.log("[DEBUG] Supabase instance in auth.js:", supabase);

// ✅ Function to check login status (ENSURE THIS IS ONLY DEFINED ONCE)
async function checkLoginStatus() {
    console.log("[DEBUG] Checking login status...");
    try {
        let { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
            console.warn("[DEBUG] No active session found. Trying to refresh...");
            const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();

            if (refreshError) {
                console.error("[DEBUG] Session refresh failed:", refreshError);
                return false;
            }

            data = refreshedData;
        }

        if (data?.session?.user) {
            console.log("[DEBUG] User is logged in:", data.session.user);
            return true;
        }

        console.warn("[DEBUG] Still no valid session.");
        return false;
    } catch (err) {
        console.error("[DEBUG] Unexpected error in checkLoginStatus:", err);
        return false;
    }
}

// ✅ Function to open login popup
async function openLoginPopup() {
    console.log("[DEBUG] Attempting to open login popup...");
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { 
                redirectTo: window.location.origin,
                skipBrowserRedirect: false
            }
        });

        if (error) {
            console.error("[DEBUG] OAuth login error:", error);
            alert("Login failed. Please try again.");
        } else {
            console.log("[DEBUG] OAuth login initiated successfully.");
        }
    } catch (err) {
        console.error("[DEBUG] Unexpected error during OAuth login:", err);
    }
}

// ✅ Ensure there is ONLY ONE export statement
export { checkLoginStatus, openLoginPopup };
