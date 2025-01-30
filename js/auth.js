import { supabase } from "./supabaseClient.js";

console.log("[DEBUG] Auth module loaded.");
console.log("[DEBUG] Supabase instance in auth.js:", supabase);

// ✅ Function to check login status
async function checkLoginStatus() {
    console.log("[DEBUG] Checking login status...");
    try {
        const { data, error } = await supabase.auth.getSession();
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

// ✅ Function to ensure a user is logged in before executing an action
function requireLogin(callback) {
    checkLoginStatus().then(isLoggedIn => {
        if (isLoggedIn) {
            callback();
        } else {
            console.warn("[DEBUG] User must be logged in to perform this action.");
            openLoginPopup();
        }
    });
}

// ✅ Function to log out user
async function logout() {
    console.log("[DEBUG] Logging out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("[DEBUG] Logout failed:", error);
    } else {
        console.log("[DEBUG] Successfully logged out.");
        localStorage.removeItem("supabase.auth.token");
        window.location.reload();
    }
}

// ✅ Ensure all necessary functions are exported
export { checkLoginStatus, openLoginPopup, logout, requireLogin };

