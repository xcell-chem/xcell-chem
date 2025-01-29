import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[DEBUG] Checking login status...');

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        console.error('[DEBUG] Error fetching user data:', error);
        alert('You must log in to view your account.');
        window.location.href = '/';
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
