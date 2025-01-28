// createshop.js
async function createShop() {
    const shopName = document.getElementById('shopName').value;

    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
        alert('You need to log in first!');
        return;
    }

    const user = session.user;

    const { data: shop, error: shopError } = await supabase
        .from('shops')
        .insert({
            name: shopName,
            owner_id: user.id, // Use the user's ID as the shop owner
        });

    if (shopError) {
        console.error('[DEBUG] Error creating shop:', shopError);
        alert('Failed to create shop. Please try again.');
    } else {
        alert('Shop created successfully!');
        window.location.href = '/myshops.html'; // Redirect to My Shops
    }
}
