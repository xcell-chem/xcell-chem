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
import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid/+esm'; // Import UUID generator

export async function registerUserInDatabase(user) {
    try {
        // Validate required user fields
        if (!user?.email) {
            console.error('[DEBUG] User object is missing required fields:', user);
            alert('Error: Missing user information. Please try logging in again.');
            return;
        }

        // Use provided user ID or generate a new UUID if necessary
        const userId = user?.id || uuidv4();

        console.log('[DEBUG] Preparing to upsert user into the database:', {
            id: userId,
            email: user.email,
            name: user?.user_metadata?.full_name || 'Anonymous',
        });

        // Step 1: Prepare user data
        const userData = {
            id: userId,
            email: user.email,
            name: user?.user_metadata?.full_name || 'Anonymous',
            created_at: new Date().toISOString(), // Only relevant for new records
            updated_at: new Date().toISOString(),
            password_hash: null, // Use null since password_hash allows null
        };

        // Step 2: Perform upsert (insert or update)
        const { data: upsertData, error: upsertError } = await supabase
            .from('users')
            .upsert(userData, { onConflict: ['id'] }); // Ensure 'id' is the conflict key

        console.log('[DEBUG] Upsert query result:', { upsertData, upsertError });

        if (upsertError) {
            console.error('[DEBUG] Error upserting user in the database:', upsertError);
            alert('Failed to update user in the database. Please try again.');
            return;
        }

        console.log('[DEBUG] User successfully upserted in the database:', upsertData);
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
