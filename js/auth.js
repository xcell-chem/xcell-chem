import { supabase } from './supabaseClient.js';

export async function checkLoginStatus() {
    console.log('[DEBUG] Starting login status check...');
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error('[DEBUG] Error fetching session:', error.message);
            alert(`Login error: ${error.message}. Try logging out and back in.`);
            return false;
        }

        if (!user) {
            console.warn('[DEBUG] No user detected.');
            return false;
        }

        console.log('[DEBUG] User is logged in:', user);
        return true;
    } catch (err) {
        console.error('[DEBUG] Unexpected error in checkLoginStatus:', err);
        return false;
    }
}
