console.log("[DEBUG] Auth module loaded.");
import { supabase } from "./supabaseClient.js";

// ✅ Function to sign up a new user
export async function signUpWithEmail(email, password) {
    console.log("[DEBUG] Signing up user:", email);

    // ✅ Step 1: Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error("[DEBUG] Signup error:", error.message);
        alert("Signup failed: " + error.message);
        return;
    }

    console.log("[DEBUG] User signed up successfully:", data.user);
}

// ✅ Function to check login status
export async function checkLoginStatus() {
    console.log("[DEBUG] Checking login status...");
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            console.warn("[DEBUG] No active session found.");
            return false;
        }
        console.log("[DEBUG] User is logged in:", user);
        return true;
    } catch (err) {
        console.error("[DEBUG] Unexpected error:", err);
        return false;
    }
}

// ✅ Function to open login popup
export async function openLoginPopup() {
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
        localStorage.removeItem("supabase.auth.token");
        window.location.reload();
    }
}
