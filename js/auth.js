import { supabase } from './supabaseClient.js';

/**
 * Check if the user is logged in.
 * @returns {Promise<boolean>} Returns true if logged in, false otherwise.
 */
export async function checkLoginStatus() {
    console.log('[DEBUG] Checking login status...');
    try {
        let { data, error } = await supabase.auth.getSession();

        if (error) {
            console.warn('[DEBUG] Error fetching session:', error.message);
            return false;
        }

        // If no session found, attempt to restore it
        if (!data.session || !data.session.user) {
            console.warn('[DEBUG] No active session found. Attempting to refresh...');
            
            await supabase.auth.refreshSession();
            data = await supabase.auth.getSession();  // Try fetching session again
            
            if (!data.session || !data.session.user) {
                return false;
            }
        }

        console.log('[DEBUG] User is logged in:', data.session.user);
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

export async function ensureUserExists(user) {
    console.log('[DEBUG] Checking if user exists in public.users...');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('auth_user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no record found
            console.error('[DEBUG] Error checking user existence:', error);
            return;
        }

        if (!data) {
            console.log('[DEBUG] User not found in public.users, inserting...');
            const { error: insertError } = await supabase.from('users').insert({
                auth_user_id: user.id,
                name: user.user_metadata.full_name || 'New User',
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
