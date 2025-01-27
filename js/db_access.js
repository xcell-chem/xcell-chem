// db_access.js
const supabaseUrl = 'https://tjbcucdewwczndkeypey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/**
 * Load products from the database
 */
// db_access.js
const supabaseUrl = 'https://tjbcucdewwczndkeypey.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/**
 * Load products from the database
 */
window.loadProducts = async function () {
    console.log('[DEBUG] Attempting to load products from the database...');
    try {
        const { data, error } = await supabaseClient
            .from('products') // Replace with your actual table name
            .select('*');

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

/**
 * Save a product to the database
 * @param {Object} productData - The product data to save
 */
window.saveProductToDB = async function (productData) {
    console.log('[DEBUG] Attempting to save product to the database...');
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .insert([productData]);

        if (error) {
            console.error('[ERROR] Failed to save product:', error);
            throw error;
        }

        console.log('[DEBUG] Product saved successfully:', data);
        return data;
    } catch (err) {
        console.error('[ERROR] Unexpected error while saving product:', err);
        throw err;
    }
};
