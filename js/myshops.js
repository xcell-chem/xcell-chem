// myshops.js
import { checkLoginStatus } from './auth.js';
import { supabase } from './supabaseClient.js';

(async function loadMyShops() {
    console.log('[DEBUG] Checking session...');
    
    const isLoggedIn = await checkLoginStatus();
    if (!isLoggedIn) {
        alert('You must be logged in to view your shops.');
        window.location.href = '/';
        return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        console.error('[DEBUG] Error retrieving user:', userError);
        alert('Failed to retrieve user information.');
        return;
    }

    console.log('[DEBUG] Fetching shops for user:', user.id);
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
        shopList.innerHTML = shops.length > 0 
            ? shops.map(shop => `<li>${shop.name} - Created on: ${new Date(shop.created_at).toLocaleDateString()}</li>`).join('')
            : '<p>No shops found.</p>';
        
        console.log('[DEBUG] Shops loaded successfully.');
    } catch (err) {
        console.error('[DEBUG] Unexpected error:', err);
        alert('An error occurred while loading your shops.');
    }
})();
