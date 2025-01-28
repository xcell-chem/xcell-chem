
import { supabase } from './supabaseClient.js'; // Import the centralized client

// Check login status
async function checkLoginStatus() {
    console.log('[DEBUG] Starting login status check...');
    const loginButton = document.getElementById('loginButton');

    try {
        // Step 1: Check if the session exists
        const { data: session, error } = await supabase.auth.getSession();

        if (error) {
            console.error('[DEBUG] Error fetching session:', error);
            loginButton.textContent = "Login";
            loginButton.onclick = openLoginPopup;
            return;
        }

        if (!session || !session.user) {
            console.log('[DEBUG] No session or user detected.');
            loginButton.textContent = "Login";
            loginButton.onclick = openLoginPopup;
            return;
        }

        console.log('[DEBUG] User session found:', session.user);

        // Step 2: Query the `users` table for additional user info
        const userId = session.user.id;
        const { data: userInfo, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_id', userId)
            .single();

        if (userError) {
            console.error('[DEBUG] Error fetching user info from users table:', userError);
        } else {
            console.log('[DEBUG] User info from users table:', userInfo);
        }

        loginButton.textContent = "Logout";
        loginButton.onclick = logout;

    } catch (err) {
        console.error('[DEBUG] Unexpected error in checkLoginStatus:', err);
    }
}

// Listen for authentication state changes
supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('[DEBUG] Auth state changed:', event);
    if (event === 'SIGNED_IN' && session) {
        const user = session.user;

        // Check if user exists in the `users` table
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_id', user.id)
            .single();

        if (!existingUser) {
            console.log('[DEBUG] User not found in users table. Inserting...');
            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    auth_user_id: user.id,
                    email: user.email,
                    name: user.user_metadata.full_name || 'Anonymous',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });

            if (insertError) {
                console.error('[DEBUG] Error inserting user into users table:', insertError);
            } else {
                console.log('[DEBUG] User successfully inserted into users table.');
            }
        } else {
            console.log('[DEBUG] User already exists in users table.');
        }
    }
});

// Open login popup for Google OAuth
async function openLoginPopup() {
    console.log('[DEBUG] Initiating Google OAuth login...');
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });

        if (error) {
            console.error('[DEBUG] Login error:', error);
            alert('Failed to log in. Please try again.');
        } else {
            console.log('[DEBUG] OAuth login initiated successfully.');
        }
    } catch (error) {
        console.error('[DEBUG] Error during login:', error);
    }
}

// Log out the current user
async function logout() {
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

document.addEventListener('DOMContentLoaded', () => {
    console.log('[DEBUG] Document loaded. Initializing...');
    checkLoginStatus();
});

export { checkLoginStatus, openLoginPopup, logout };
