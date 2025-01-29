import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tjbcucdewwczndkeypey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiwiYXVkIjoidGp...'; // Truncated for security

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Ensure the user exists in public.users after login.
 * Syncs with Supabase authentication.
 */
export async function ensureUserExists(user) {
    console.log('[DEBUG] Ensuring user exists in public.users...');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('auth_user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('[DEBUG] Error checking user existence:', error);
            return;
        }

        if (!data) {
            console.log('[DEBUG] User not found in public.users, inserting...');
            const { error: insertError } = await supabase.from('users').insert({
                auth_user_id: user.id,
                name: user.user_metadata?.full_name || 'New User',
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
 * Check and handle OAuth session exchange.
 */
(async () => {
    console.log('[DEBUG] Checking for OAuth session...');
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('code')) {
        console.log('[DEBUG] Processing OAuth login...');
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

        if (error) {
            console.error('[DEBUG] Error exchanging OAuth code:', error);
        } else {
            console.log('[DEBUG] OAuth session exchanged successfully.');
            localStorage.setItem('supabaseSession', JSON.stringify(data.session));

            // Ensure the user exists in public.users
            if (data.session?.user) {
                await ensureUserExists(data.session.user);
            }
        }

        // Remove query parameters to prevent login loops
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
})();
