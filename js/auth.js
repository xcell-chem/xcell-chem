
import { supabase } from './supabaseConfig.js';

// Check login status
async function checkLoginStatus() {
    console.log('[DEBUG] Starting login status check...');
    const user = supabase.auth.user();

    if (!user) {
        console.log('[DEBUG] No user detected. Opening login popup...');
        openLoginPopup();
    } else {
        console.log('[DEBUG] User detected:', user);
    }
}

// Open login popup
async function openLoginPopup() {
    console.log('[DEBUG] Initiating Google OAuth login...');
    const { user, error } = await supabase.auth.signIn({
        provider: 'google',
    });

    if (error) {
        console.error('[DEBUG] Login error:', error);
        alert('Failed to log in. Please try again.');
    } else {
        console.log('[DEBUG] User successfully logged in:', user);
        await registerUserInDatabase(user);
    }
}

// Register user in database
async function registerUserInDatabase(user) {
    console.log('[DEBUG] Registering user in the database:', user);

    const { data, error } = await supabase
        .from('users')
        .upsert({
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name,
        });

    if (error) {
        console.error('[DEBUG] Error registering user:', error);
    } else {
        console.log('[DEBUG] User successfully registered in the database:', data);
    }
}

// Export functions for reuse
export { checkLoginStatus, openLoginPopup, registerUserInDatabase };
