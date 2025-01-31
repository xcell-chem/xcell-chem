import { requireLogin } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("[DEBUG] 🚀 Loading My Shops Page...");
    
    // Ensure the user is logged in before allowing access
    await requireLogin();

    console.log("[DEBUG] ✅ User is authenticated. Fetching shops...");

    // Function to load and display user's shops
    async function loadShops() {
        const { data: shops, error } = await supabase
            .from('shops')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("[DEBUG] ❌ Error fetching shops:", error);
            alert("Failed to load shops.");
            return;
        }

        const shopsContainer = document.getElementById('shopsContainer');
        shopsContainer.innerHTML = ''; // Clear previous data

        if (shops.length === 0) {
            shopsContainer.innerHTML = '<p>No shops found.</p>';
            return;
        }

        shops.forEach(shop => {
            const shopElement = document.createElement('div');
            shopElement.classList.add('shop-item');
            shopElement.innerHTML = `
                <h3>${shop.name}</h3>
                <p>Created at: ${new Date(shop.created_at).toLocaleString()}</p>
                <button onclick="viewShop('${shop.id}')">View Shop</button>
            `;
            shopsContainer.appendChild(shopElement);
        });
    }

    // Function to handle clicking "View Shop"
    window.viewShop = function(shopId) {
        console.log(`[DEBUG] 🔍 Viewing shop ID: ${shopId}`);
        window.location.href = `/shop.html?id=${shopId}`;
    };

    // Load shops when the page is ready
    await loadShops();
});
