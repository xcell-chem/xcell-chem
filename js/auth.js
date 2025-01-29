import { supabase } from './supabaseClient.js';

/**
 * Check if the user is logged in.
 * @returns {Promise<boolean>} Returns true if logged in, false otherwise.
 */
export async function checkLoginStatus() {
    console.log('[DEBUG] Starting login status check...');
    try {
        let { data, error } = await supabase.auth.getSession();
        const session = data?.session;

        if (error) {
            console.warn('[DEBUG] Error fetching session:', error.message);
            return false;
        }

        if (!session || !session.user) {
            console.warn('[DEBUG] No active user session. Trying stored session...');
            
            // ✅ Try restoring session manually
            const storedSession = localStorage.getItem('supabaseSession');
            if (storedSession) {
                session = JSON.parse(storedSession);
                console.log('[DEBUG] Restored session from localStorage:', session);
            }

            if (!session || !session.user) {
                return false;
            }
        }

        console.log('[DEBUG] User is logged in:', session.user);
        return true;
    } catch (err) {
        console.error('[DEBUG] Unexpected error in checkLoginStatus:', err);
        return false;
    }
}

/**
 * Redirect to login page only if necessary.
 */
export async function requireLogin(callback) {
    const isLoggedIn = await checkLoginStatus();
    
    if (!isLoggedIn) {
        console.warn('[DEBUG] User is not logged in. Redirecting...');

        // ✅ Prevent infinite redirect loops
        if (window.location.pathname !== '/' && !window.location.search.includes('error')) {
            window.location.href = '/';
        }
    } else if (typeof callback === 'function') {
        callback();
    }
}

/**
 * Open the OAuth popup for logging in with Google.
 */
export async function openLoginPopup() {
    console.log('[DEBUG] Attempting to open login popup for Google OAuth...');
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { 
                redirectTo: window.location.origin,  // ✅ Ensure this matches your Supabase settings
                skipBrowserRedirect: false
            }
        });

        if (error) {
            console.error('[DEBUG] OAuth login error:', error);
            alert('Login failed. Please try again.');
        } else {
            console.log('[DEBUG] OAuth login initiated successfully.');
        }
    } catch (err) {
        console.error('[DEBUG] Unexpected error during OAuth login:', err);
    }
}

/**
 * Log out the current user.
 */
export async function logout() {
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
