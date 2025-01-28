
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://tjbcucdewwczndkeypey.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
async function checkLoginStatus() {
    console.log('[DEBUG] Starting login status check...');
    try {
        const { data: session, error } = await supabase.auth.getSession();
        if (error || !session) {
            console.log('[DEBUG] No session found. Opening login popup...');
            openLoginPopup();
            return;
        }

        const user = session.user;
        if (!user) {
            console.log('[DEBUG] No user detected. Opening login popup...');
            openLoginPopup();
        } else {
            console.log('[DEBUG] User detected:', user);
        }
    } catch (error) {
        console.error('[DEBUG] Error checking login status:', error);
    }
}



// Open login popup
async function openLoginPopup() {
    console.log('[DEBUG] Initiating Google OAuth login...');
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            console.error('[DEBUG] Login error:', error);
            alert('Failed to log in. Please try again.');
        } else {
            console.log('[DEBUG] OAuth login successful:', data);
            await registerUserInDatabase(data.user); // Pass user data to register
        }
    } catch (error) {
        console.error('[DEBUG] Error during login:', error);
    }
}


async function registerUserInDatabase(user) {
    try {
        if (!user?.id || !user?.email || !user?.user_metadata?.full_name) {
            console.error('[DEBUG] User object is missing required fields:', user);
            alert('Error: Missing user information. Please try logging in again.');
            return;
        }

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
            alert('Failed to register user in the database. Please try again.');
        } else {
            console.log('[DEBUG] User successfully registered in the database:', data);
            return data;
        }
    } catch (error) {
        console.error('[DEBUG] Unexpected error during user registration:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}


// Attach functions to the global window object
window.checkLoginStatus = checkLoginStatus;
window.openLoginPopup = openLoginPopup;
window.registerUserInDatabase = registerUserInDatabase;
