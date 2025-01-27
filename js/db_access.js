// db_access.js
const supabaseUrl = 'https://tjbcucdewwczndkeypey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/**
 * Load products from the database
 */
window.loadProducts = async function loadProducts() {
    console.log('[DEBUG] Attempting to load products from the database...');
    try {
        const { data, error } = await supabaseClient
            .from('product_category')
            .select(`
                *,
                products (name)
            `);

        if (error) {
            console.error('[ERROR] Failed to load products:', error);
            return [];
        }

        console.log('[DEBUG] Products fetched successfully:', data);
        return data;
    } catch (err) {
        console.error('[ERROR] Unexpected error while loading products:', err);
        return [];
    }
};
