// auth.js
import { supabaseClient } from './supabaseClient.js'; // Import the centralized client

async function loadProducts() {
    try {
        console.log('[loadProducts] Fetching products...');
        const { data, error } = await supabaseClient
            .from('products')
            .select(`
                *,
                product_prices (quantity, price),
                product_category (categories (id, name))
            `);

        if (error) throw error;

        console.log('[loadProducts] Products fetched:', data);
        return data;
    } catch (error) {
        console.error('[Error] Failed to load products:', error);
        alert('Failed to load products. Check the console for details.');
        return [];
    }
}
/**
 * Load all categories from the database
 */
async function loadCategories() {
    try {
        console.log('[loadCategories] Fetching categories...');
        const { data: categories, error } = await supabaseClient.from('categories').select('*');
        if (error) throw error;

        console.log('[loadCategories] Categories fetched:', categories);
        return categories;
    } catch (error) {
        console.error('[Error] Failed to load categories:', error);
        alert('Failed to load categories. Check the console for details.');
        return [];
    }
}

// Export or expose globally if needed
window.loadCategories = loadCategories;


/**
 * Remove a category from a product
 * @param {number} productId - Product ID
 * @param {number} categoryId - Category ID
 */
async function removeCategoryFromProduct(productId, categoryId) {
    try {
        const { error } = await supabaseClient
            .from('product_category')
            .delete()
            .eq('product_id', productId)
            .eq('category_id', categoryId);

        if (error) throw error;

        console.log('[removeCategoryFromProduct] Category removed from product');
    } catch (error) {
        console.error('[Error] Failed to remove category:', error);
    }
}
