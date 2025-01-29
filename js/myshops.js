import { requireLogin } from './auth.js';
import { supabase } from './supabaseClient.js';
import { requireLogin } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    requireLogin(() => {
        console.log("[DEBUG] User is logged in, loading shop info...");
        // Load shop info here
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    await requireLogin(); // Ensure user is logged in

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        console.error('[DEBUG] Failed to retrieve user:', error);
        return;
    }


    console.log('[DEBUG] Fetching shops for user:', user.id);
    try {
        const { data: shops, error: shopError } = await supabase
            .from('shops')
            .select('*')
            .eq('owner_id', user.id);

        if (shopError) {
            console.error('[DEBUG] Error fetching shops:', shopError);
            alert('Failed to load your shops.');
            return;
        }

        const shopList = document.getElementById('shopList');
        shopList.innerHTML = shops.length > 0
            ? shops.map(shop => `<li>${shop.name} - Created on: ${new Date(shop.created_at).toLocaleDateString()}</li>`).join('')
            : '<p>No shops found.</p>';

        console.log('[DEBUG] Shops loaded successfully.');
    } catch (err) {
        console.error('[DEBUG] Unexpected error:', err);
    }
});
