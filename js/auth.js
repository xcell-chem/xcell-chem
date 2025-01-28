// auth.js
import { supabase } from './supabaseClient.js'; // Import the centralized client

// Check login status
async function checkLoginStatus() {
    console.log('[DEBUG] Starting login status check...');
    console.log('[DEBUG] Current URL:', window.location.href);

    try {
        const { data: session, error } = await supabase.auth.getSession();

        if (error) {
            console.error('[DEBUG] Error fetching session:', error);
        }

        if (!session || !session.user) {
            console.log('[DEBUG] No session or user detected.');
            return false;
        }

        console.log('[DEBUG] User session found:', session.user);
        return true;
    } catch (err) {
        console.error('[DEBUG] Unexpected error in checkLoginStatus:', err);
        return false;
    }
}
// Clean up the URL after OAuth
if (window.location.search) {
    const url = new URL(window.location.href);
    url.search = ''; // Remove query parameters
    window.history.replaceState({}, document.title, url.toString());
}
async function debugSession() {
    const { data: user, error } = await supabase.auth.getUser();
    console.log('[DEBUG] Retrieved user data:', user);
    if (error) {
        console.error('[DEBUG] Error fetching user data:', error);
    }
}

document.addEventListener('DOMContentLoaded', debugSession);

supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('[DEBUG] Auth state changed:', event);
    if (event === 'SIGNED_IN') {
        console.log('[DEBUG] User signed in:', session.user);
        await registerUserInDatabase(session.user);
        window.location.href = '/'; // Redirect back to index
    } else if (event === 'SIGNED_OUT') {
        console.log('[DEBUG] User signed out.');
    }
});


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
export async function registerUserInDatabase(user) {
    try {
        // Validate required user fields
        if (!user?.email) {
            console.error('[DEBUG] User object is missing required fields:', user);
            alert('Error: Missing user information. Please try logging in again.');
            return;
        }

        const userId = user.id; // Use the ID from the auth.users table

        console.log('[DEBUG] Checking if user exists in the database:', {
            userId,
            userObject: user,
        });

        // Step 1: Check if the user already exists in the `users` table
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_id', userId) // Check by the new foreign key
            .single();

        console.log('[DEBUG] Database query result:', { existingUser, checkError });

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

        // Step 2: Prepare the user data for insertion
        const name = user?.user_metadata?.full_name || 'Anonymous'; // Extract user's name
        const email = user?.email; // Extract user's email
        const createdAt = new Date().toISOString();
        const updatedAt = new Date().toISOString();
        const passwordHash = null; // Leave as null since password_hash allows null

        console.log('[DEBUG] Data to insert into the database:', {
            auth_user_id: userId, // Link to the auth user ID
            email,
            name,
            created_at: createdAt,
            updated_at: updatedAt,
            password_hash: passwordHash,
        });

        // Step 3: Insert a new user record
        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert({
                auth_user_id: userId, // Use the auth user ID
                email: email,
                name: name,
                created_at: createdAt,
                updated_at: updatedAt,
                password_hash: passwordHash,
            });

        console.log('[DEBUG] Insert query result:', { insertData, insertError });

        // Handle insert errors
        if (insertError) {
            console.error('[DEBUG] Error creating user in the database:', insertError);
            alert('Failed to create user in the database. Please try again.');
            return;
        }

        console.log('[DEBUG] User successfully created in the database:', insertData);
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
