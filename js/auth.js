import { supabase } from './supabaseClient.js';

/**
 * Check if the user is logged in and refresh session if needed.
 * @returns {Promise<boolean>} Returns true if logged in, false otherwise.
 */
export async function checkLoginStatus() {
    console.log('[DEBUG] Starting login status check...');
    try {
        let { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            console.warn('[DEBUG] No active session found. Attempting session refresh...');
            
            // Try to refresh the session
            const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError || !refreshedSession) {
                console.error('[DEBUG] Session refresh failed:', refreshError);
                return false;
            }

            // Try getting the user again
            ({ data: { user }, error } = await supabase.auth.getUser());
            if (error || !user) {
                console.warn('[DEBUG] No user detected after refresh.');
                return false;
            }
        }

        console.log('[DEBUG] User is logged in:', user);
        return true;
    } catch (err) {
        console.error('[DEBUG] Unexpected error in checkLoginStatus:', err);
        return false;
    }
}
