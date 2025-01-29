import { supabase } from './supabaseClient.js';
/**
 * Redirect to login page only if necessary.
 */
export async function requireLogin(callback) {
    const isLoggedIn = await checkLoginStatus();
    
    if (!isLoggedIn) {
        console.warn('[DEBUG] User is not logged in. Redirecting...');
        window.location.href = '/login.html';  // Change this to your actual login page
    } else if (typeof callback === 'function') {
        callback();
    }
}
/**
 * Ensure the user exists in public.users after login.
 * @param {Object} user - The logged-in user object.
 */
export async function ensureUserExists(user) {
    console.log('[DEBUG] Ensuring user exists...');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('auth_user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('[DEBUG] User check error:', error);
            return;
        }

        if (!data) {
            console.log('[DEBUG] User not found, inserting...');
            const { error: insertError } = await supabase.from('users').upsert([
                {
                    auth_user_id: user.id,
                    name: user.user_metadata?.full_name || 'New User',
                    email: user.email
                }
            ], { onConflict: ['auth_user_id'] });

            if (insertError) {
                console.error('[DEBUG] Error inserting user:', insertError);
            } else {
                console.log('[DEBUG] User inserted successfully.');
            }
        } else {
            console.log('[DEBUG] User already exists.');
        }
    } catch (err) {
        console.error('[DEBUG] Unexpected error in ensureUserExists:', err);
    }
}

/**
 * Check if the user is logged in and restore session if needed.
 */
export async function checkLoginStatus() {
    console.log('[DEBUG] Checking login status...');
    try {
        let { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
            console.warn('[DEBUG] No active session found. Trying to refresh...');
            const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError) {
                console.error('[DEBUG] Session refresh failed:', refreshError);
                return false;
            }

            data = refreshedData;
        }

        if (data.session && data.session.user) {
            console.log('[DEBUG] User is logged in:', data.session.user);
            return true;
        }

        console.warn('[DEBUG] Still no valid session.');
        return false;
    } catch (err) {
        console.error('[DEBUG] Unexpected error in checkLoginStatus:', err);
        return false;
    }
}
    console.log('[DEBUG] Checking login status...');
    try {
        let { data, error } = await supabase.auth.getSession();

        if (error) {
            console.warn('[DEBUG] Error fetching session:', error.message);
            return false;
        }

        if (!data.session || !data.session.user) {
            console.warn('[DEBUG] No active session found. Attempting to refresh...');
            const { error: refreshError } = await supabase.auth.refreshSession();

            if (refreshError) {
                console.error('[DEBUG] Failed to refresh session:', refreshError);
                return false;
            }

            data = await supabase.auth.getSession();
            if (!data.session || !data.session.user) {
                console.warn('[DEBUG] No valid session after refresh.');
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


/**
 * Listen for authentication state changes and store session in localStorage.
 */
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        console.log("[DEBUG] Saving session to localStorage...");
        localStorage.setItem("supabaseSession", JSON.stringify(session));
    } else {
        console.log("[DEBUG] Clearing session from localStorage...");
        localStorage.removeItem("supabaseSession");
    }
});

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
