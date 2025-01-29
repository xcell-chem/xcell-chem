import { supabase } from './supabaseClient.js';

/**
 * Check if the user is logged in.
 * @returns {Promise<boolean>} Returns true if logged in, false otherwise.
 */
export async function checkLoginStatus() {
    console.log('[DEBUG] Starting login status check...');
    try {
        let { data: session, error } = await supabase.auth.getSession();

        if (error) {
            console.warn('[DEBUG] Error fetching session:', error.message);
            return false;
        }

        if (!session || !session.session || !session.session.user) {
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
export async function requireLogin() {
    const isLoggedIn = await checkLoginStatus();
    
    if (!isLoggedIn) {
        console.warn('[DEBUG] User is not logged in. Redirecting...');

        // ✅ Prevent infinite redirect loops
        if (window.location.pathname !== '/' && !window.location.search.includes('error')) {
            window.location.href = '/';
        }
    }
}
