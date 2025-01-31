console.log("[DEBUG] Auth module loaded.");
import { supabase } from "./supabaseClient.js";

// ✅ Function to sign up a new user
export async function signUpWithEmail(email, password) {
    console.log("[DEBUG] Signing up user:", email);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error("[DEBUG] Signup error:", error.message);
        alert("Signup failed: " + error.message);
        return;
    }

    console.log("[DEBUG] User signed up successfully:", data.user);
}

// ✅ Function to check login status and refresh session if needed
export async function checkLoginStatus() {
    console.log("[DEBUG] Checking login status...");
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
            console.warn("[DEBUG] No active session found. Attempting to refresh...");
            await supabase.auth.refreshSession();  // Try refreshing session
            const { data: refreshedSession, error: refreshError } = await supabase.auth.getSession();
            if (refreshError || !refreshedSession.session) {
                console.warn("[DEBUG] Session refresh failed.");
                return false;
            }
            console.log("[DEBUG] Session refreshed successfully.");
            return true;
        }

        console.log("[DEBUG] User is logged in:", user);
        return true;
    } catch (err) {
        console.error("[DEBUG] Unexpected error:", err);
        return false;
    }
}

// ✅ Ensure auth state is tracked
supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(`[DEBUG] Auth state changed: ${event}`);
    if (session) {
        console.log("[DEBUG] New session detected. Saving...");
        localStorage.setItem("supabase.auth.token", JSON.stringify(session));
    } else {
        console.warn("[DEBUG] Session cleared.");
        localStorage.removeItem("supabase.auth.token");
    }
});

// ✅ Function to open login popup
export async function openLoginPopup() {
    console.log("[DEBUG] Attempting to open login popup...");
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin }
        });

        if (error) {
            console.error("[DEBUG] OAuth login error:", error);
            alert("Login failed. Please try again.");
        } else {
            console.log("[DEBUG] OAuth login initiated successfully. Awaiting redirect...");
        }
    } catch (err) {
        console.error("[DEBUG] Unexpected error during OAuth login:", err);
    }
}

// ✅ Function to ensure a user is logged in before executing an action
export function requireLogin(callback) {
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
export async function logout() {
    console.log("[DEBUG] Logging out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("[DEBUG] Logout failed:", error);
    } else {
        console.log("[DEBUG] Successfully logged out.");
        window.location.reload();
    }
}
