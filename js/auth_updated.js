
import { supabase } from './supabaseClient.js';

// Check login status
async function checkLoginStatus() {
    console.log('[DEBUG] Starting login status check...');
    const loginButton = document.getElementById('loginButton');

    try {
        const { data: session, error } = await supabase.auth.getSession();

        if (error) {
            console.error('[DEBUG] Error fetching session:', error);
            loginButton.textContent = "Login";
            loginButton.onclick = openLoginPopup;
            return;
        }

        if (!session || !session.user) {
            console.log('[DEBUG] No session or user detected.');
            loginButton.textContent = "Login";
            loginButton.onclick = openLoginPopup;
            return;
        }

        console.log('[DEBUG] User session found:', session.user);
        loginButton.textContent = "Logout";
        loginButton.onclick = logout;
    } catch (err) {
        console.error('[DEBUG] Unexpected error in checkLoginStatus:', err);
    }
}

// Handle session after OAuth redirect
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[DEBUG] Document loaded. Initializing...');

    try {
        if (window.location.search) {
            console.log('[DEBUG] URL contains query parameters. Ensuring session is handled...');
            const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
            if (error) {
                console.error('[DEBUG] Error processing session from URL:', error);
            } else {
                console.log('[DEBUG] Session successfully processed from URL.');
            }

            // Clean up the URL
            const url = new URL(window.location.href);
            url.search = '';
            window.history.replaceState({}, document.title, url.toString());
        }

        // Attempt to refresh session if none exists
        const { data: session, error } = await supabase.auth.getSession();
        if (error || !session) {
            console.log('[DEBUG] No session found. Attempting to refresh session...');
            const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
                console.error('[DEBUG] Failed to refresh session:', refreshError);
            } else {
                console.log('[DEBUG] Session refreshed:', refreshedSession);
            }
        }
    } catch (err) {
        console.error('[DEBUG] Unexpected error while initializing session:', err);
    }

    checkLoginStatus();
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
