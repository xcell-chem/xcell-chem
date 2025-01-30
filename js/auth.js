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
        // 🔍 First, try getting the session from localStorage
        const storedSession = JSON.parse(localStorage.getItem("supabaseSession"));
        if (storedSession && storedSession.user) {
            console.log("[DEBUG] Found stored session:", storedSession.user);
            return true;
        }

        // 🔄 If no session in localStorage, check Supabase
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

        if (data?.session?.user) {
            console.log('[DEBUG] User is logged in:', data.session.user);
            localStorage.setItem("supabaseSession", JSON.stringify(data.session)); // ✅ Save session manually
            return true;
        }

        console.warn('[DEBUG] Still no valid session.');
        return false;
    } catch (err) {
        console.error('[DEBUG] Unexpected error in checkLoginStatus:', err);
        return false;
    }
}



supabase.auth.onAuthStateChange((event, session) => {
    console.log("[DEBUG] Auth state changed:", event);
    
    if (session) {
        console.log("[DEBUG] Storing session in localStorage...");
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
            localStorage.clear();  // ✅ Ensures session is fully removed
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
