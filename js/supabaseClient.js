import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://tjbcucdewwczndkeypey.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: true,  // ✅ Ensures session persists
        autoRefreshToken: true, // ✅ Automatically refresh expired sessions
        detectSessionInUrl: true, // ✅ Handles OAuth redirects properly
    },
});

// ✅ Handle OAuth redirects properly
(async () => {
    console.log('[DEBUG] Checking for OAuth session...');
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('code')) {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
            console.error('[DEBUG] Error exchanging OAuth code:', error);
        } else {
            console.log('[DEBUG] OAuth session exchanged successfully.');
        }

        // ✅ Remove query params from URL to prevent infinite loops
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document
