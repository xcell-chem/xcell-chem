import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://tjbcucdewwczndkeypey.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: true,  // ✅ Ensures session is stored
        autoRefreshToken: true, // ✅ Enables automatic token refresh
        detectSessionInUrl: true, // ✅ Handles OAuth redirects properly
    },
});

// ✅ Handle OAuth login processing
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

            // ✅ Store session explicitly
            localStorage.setItem('supabaseSession', JSON.stringify(data.session));
        }

        // ✅ Remove query parameters to prevent login loops
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }

    // ✅ Fetch latest session after OAuth processing
    const { data: session, error } = await supabase.auth.getSession();
    if (error || !session || !session.session || !session.session.user) {
        console.warn('[DEBUG] No active session found after OAuth check.');
    } else {
        console.log('[DEBUG] Active session restored:', session.session.user);
    }
})();
