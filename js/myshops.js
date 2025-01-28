
// myshops.js
import { checkSession } from './auth.js';
import { supabase } from './supabaseClient.js';

(async function loadMyShops() {
    const user = await checkSession();
    if (!user) return;

    try {
        const { data: shops, error } = await supabase
            .from('shops')
            .select('*')
            .eq('owner_id', user.id);

        if (error) {
            console.error('[DEBUG] Error fetching shops:', error);
            alert('Failed to load your shops.');
            return;
        }

        const shopList = document.getElementById('shopList');
        shopList.innerHTML = shops
            .map(shop => `<li>${shop.name} - Created on: ${new Date(shop.created_at).toLocaleDateString()}</li>`)
            .join('');
    } catch (err) {
        console.error('[DEBUG] Unexpected error:', err);
        alert('An error occurred while loading your shops.');
    }
})();
