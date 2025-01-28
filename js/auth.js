
import { supabase } from './supabaseClient.js';

// Check login status
async function checkLoginStatus() {
    console.log('[DEBUG] Starting login status check...');
    const loginButton = document.getElementById('loginButton');

    try {
        // Helper to update the login button UI
        const updateLoginButton = (text, action) => {
            loginButton.textContent = text;
            loginButton.onclick = action;
        };

        // Fetch the current session
        let { data: session, error } = await supabase.auth.getSession();

        if (error || !session || !session.user) {
            console.log('[DEBUG] No session or user detected. Attempting session refresh...');
            const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError || !refreshedSession) {
                console.log('[DEBUG] Session refresh failed or no user detected.');
                updateLoginButton("Login", openLoginPopup);
                return false;
            }
            session = refreshedSession;
        }

        console.log('[DEBUG] User session found:', session.user);

        // Set login flag and update UI
        window.isLoggedIn = true;
        updateLoginButton("Logout", logout);
        return true;
    } catch (err) {
        console.error('[DEBUG] Unexpected error in checkLoginStatus:', err);
        return false;
    }
}


// Refresh session if needed
async function refreshSessionIfNeeded() {
    console.log('[DEBUG] Attempting to refresh session...');
    const { data: refreshedSession, error } = await supabase.auth.refreshSession();

    if (error) {
        console.error('[DEBUG] Error refreshing session:', error);
        return false;
    }

    console.log('[DEBUG] Session refreshed successfully:', refreshedSession);
    return true;
}

// Handle session after OAuth redirect
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[DEBUG] Document loaded. Initializing...');

    try {
        // Check if the URL contains OAuth query parameters
        if (window.location.search) {
            console.log('[DEBUG] URL contains query parameters. Processing session from URL...');
            const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
            if (error) {
                console.error('[DEBUG] Error processing session from URL:', error);
            } else {
                console.log('[DEBUG] Session successfully processed from URL.');
            }

            // Clean up the URL to remove query parameters
            const url = new URL(window.location.href);
            url.search = '';
            window.history.replaceState({}, document.title, url.toString());
        }

        // Check login status or refresh session
        if (!(await checkLoginStatus())) {
            await refreshSessionIfNeeded();
        }
    } catch (err) {
        console.error('[DEBUG] Unexpected error during initialization:', err);
    }
});

// Open login popup for Google OAuth
async function openLoginPopup() {
    console.log('[DEBUG] Initiating Google OAuth login...');
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}`,
            },
        });

        if (error) {
            console.error('[DEBUG] Login error:', error);
            alert('Failed to log in. Please try again.');
        } else {
            console.log('[DEBUG] OAuth login initiated successfully.');
        }
    } catch (error) {
        console.error('[DEBUG] Error during login:', error);
    }
}

// Log out the current user
async function logout() {
    console.log('[DEBUG] Logging out the user...');
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('[DEBUG] Logout error:', error);
            alert('Failed to log out. Please try again.');
        } else {
            console.log('[DEBUG] User logged out successfully.');
            alert('Logged out successfully!');
            location.reload();
        }
    } catch (err) {
        console.error('[DEBUG] Unexpected error during logout:', err);
    }
}

export { checkLoginStatus, openLoginPopup, logout };
