import { supabase } from './supabaseClient.js';

/**
 * Ensure the user exists in public.users after login.
 * @param {Object} user - The logged-in user object.
 */
export async function ensureUserExists(user) {
    console.log('[DEBUG] Checking if user exists in public.users...');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('auth_user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('[DEBUG] Error checking user existence:', error);
            return;
        }

        if (!data) {
            console.log('[DEBUG] User not found in public.users, inserting...');
            const { error: insertError } = await supabase.from('users').insert({
                auth_user_id: user.id,
                name: user.user_metadata?.full_name || 'New User',
                email: user.email
            });

            if (insertError) {
                console.error('[DEBUG] Error inserting user into public.users:', insertError);
            } else {
                console.log('[DEBUG] User inserted successfully into public.users');
            }
        } else {
            console.log('[DEBUG] User already exists in public.users');
        }
    } catch (err) {
        console.error('[DEBUG] Unexpected error in ensureUserExists:', err);
    }
}

/**
 * Check if the user is logged in and sync with public.users.
 */
export async function checkLoginStatus() {
    console.log('[DEBUG] Checking login status...');
    try {
        let { data, error } = await supabase.auth.getSession();

        if (error) {
            console.warn('[DEBUG] Error fetching session:', error.message);
            return false;
        }

        if (!data.session || !data.session.user) {
            console.warn('[DEBUG] No active session found. Attempting to refresh...');
            await supabase.auth.refreshSession();
            data = await supabase.auth.getSession();

            if (!data.session || !data.session.user) {
                return false;
            }
        }

        console.log('[DEBUG] User is logged in:', data.session.user);

        // ✅ Ensure user exists in public.users
        await ensureUserExists(data.session.user);

        return true;
    } catch (err) {
        console.error('[DEBUG] Unexpected error in checkLoginStatus:', err);
        return false;
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
                redirectTo: window.location.origin,
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

// ✅ Attach functions to window for global access in HTML
window.openLoginPopup = openLoginPopup;
window.logout = logout;
