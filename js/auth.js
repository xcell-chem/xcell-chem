// auth.js
import { supabase } from './supabaseClient.js'; // Import the centralized client

// Check login status
async function checkLoginStatus() {
    console.log('[DEBUG] Starting login status check...');

    try {
        const { data: session, error } = await supabase.auth.getSession();
        if (error || !session) {
            console.log('[DEBUG] No session found. Redirecting to login...');
            openLoginPopup();
            return;
        }

        const user = session.user;
        if (!user) {
            console.log('[DEBUG] No user detected. Opening login popup...');
            openLoginPopup();
        } else {
            console.log('[DEBUG] User detected:', user);
            await registerUserInDatabase(user);
        }
    } catch (error) {
        console.error('[DEBUG] Error checking login status:', error);
    }
}

// Open login popup for Google OAuth
async function openLoginPopup() {
    console.log('[DEBUG] Initiating Google OAuth login...');
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });

        if (error) {
            console.error('[DEBUG] Login error:', error);
            alert('Failed to log in. Please try again.');
        } else {
            console.log('[DEBUG] OAuth login successful:', data);
        }
    } catch (error) {
        console.error('[DEBUG] Error during login:', error);
    }
}

// Register user in the database
export async function registerUserInDatabase(user) {
    try {
        if (!user?.id || !user?.email) {
            console.error('[DEBUG] User object is missing required fields:', user);
            alert('Error: Missing user information. Please try logging in again.');
            return;
        }

        // Extract additional OAuth details
        const name = user?.user_metadata?.full_name || 'Anonymous';
        const provider = user?.app_metadata?.provider || 'unknown';
        const oauthId = user?.id || '';

        console.log('[DEBUG] Registering user in the database:', {
            id: user.id,
            email: user.email,
            name,
            provider,
            oauthId,
        });

        // Upsert user into the 'users' table
        const { data, error } = await supabase
            .from('users')
            .upsert({
                id: user.id,
                email: user.email,
                name,
                oauth_provider: provider,
                oauth_id: oauthId,
                last_login: new Date().toISOString(),
            });

        if (error) {
            console.error('[DEBUG] Error registering user in the database:', error);
            alert('Failed to register user in the database. Please try again.');
        } else {
            console.log('[DEBUG] User successfully registered in the database:', data);
        }
    } catch (err) {
        console.error('[DEBUG] Unexpected error during user registration:', err);
        alert('An unexpected error occurred. Please try again.');
    }
}


// Listen for authentication state changes
supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('[DEBUG] Auth state changed:', event, session);

    if (session) {
        const user = session.user;
        console.log('[DEBUG] User session detected:', user);
        await registerUserInDatabase(user);
    } else {
        console.log('[DEBUG] No session detected. User logged out.');
    }
});

// Expose functions globally for use in inline scripts (if needed)
window.checkLoginStatus = checkLoginStatus;
window.openLoginPopup = openLoginPopup;
