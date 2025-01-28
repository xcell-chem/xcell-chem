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

        console.log('[DEBUG] Checking if user exists in the database:', { id: userId, ...user });

        // Step 1: Check if the user already exists in the `users` table
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        console.log('[DEBUG] Check result:', { existingUser, checkError });

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('[DEBUG] Error checking user in the database:', checkError);
            alert('Failed to check user in the database. Please try again.');
            return;
        }

        if (existingUser) {
            console.log('[DEBUG] User already exists in the database:', existingUser);
            return; // Exit if the user already exists
        }

        console.log('[DEBUG] User not found. Preparing to insert a new record.');

        // Step 2: Insert a new user record
        const name = user?.user_metadata?.full_name || 'Anonymous'; // Extract user's name
        const email = user?.email; // Extract user's email
        const passwordHash = null; // Leave as null since password_hash allows null

        console.log('[DEBUG] Data to insert:', {
            id: userId,
            email: email,
            name: name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            password_hash: passwordHash,
        });

        const { data, error } = await supabase
            .from('users')
            .insert({
                id: userId,
                email: email,
                name: name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                password_hash: passwordHash,
            });

        console.log('[DEBUG] Insert result:', { data, error });

        if (error) {
            console.error('[DEBUG] Error creating user in the database:', error);
            alert('Failed to create user in the database. Please try again.');
        } else {
            console.log('[DEBUG] User successfully created in the database:', data);
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
