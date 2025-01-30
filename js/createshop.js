import { supabase } from './supabaseClient.js';
import { requireLogin } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-shop-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const shopNameInput = document.getElementById('shopName');
        const shopName = shopNameInput.value.trim();
        const submitButton = form.querySelector('button');

        if (!shopName) {
            alert('Shop name cannot be empty.');
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Creating...';

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                alert('You need to log in first!');
                window.location.href = '/';
                return;
            }

            console.log('[DEBUG] User found:', user.id);

            // Insert shop into database
            const { error: shopError } = await supabase
                .from('shops')
                .insert({ name: shopName, owner_id: user.id });

            if (shopError) {
                console.error('[DEBUG] Error creating shop:', shopError);
                alert(`Failed to create shop: ${shopError.message}`);
            } else {
                alert('Shop created successfully!');
                window.location.href = '/myshops.html';
            }
        } catch (error) {
            console.error('[DEBUG] Unexpected error:', error);
            alert('An unexpected error occurred.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Create Shop';
        }
    });
});
