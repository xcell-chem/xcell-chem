import { requireLogin } from './auth.js';
import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    requireLogin(() => {
        console.log("[DEBUG] User is logged in, loading account info...");
        // Load user account info here
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    await requireLogin(); // Ensure user is logged in

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        console.error('[DEBUG] Failed to retrieve user:', error);
        return;
    }

    console.log('[DEBUG] User retrieved:', user);

    const accountInfo = document.getElementById('account-info');
    accountInfo.innerHTML = `
        <h3>Account Information</h3>
        <p><strong>Name:</strong> ${user.user_metadata?.full_name || 'Unknown'}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Last Login:</strong> ${new Date(user.last_sign_in_at).toLocaleString()}</p>
    `;
});
