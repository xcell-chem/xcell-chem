import { supabase } from './supabaseClient.js';

/**
 * Load all products from the database.
 */
export async function loadProducts() {
    try {
        console.log('[DEBUG] Fetching products...');
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                product_prices (quantity, price),
                product_category (categories (id, name))
            `);

        if (error) throw error;

        console.log('[DEBUG] Products fetched:', data);
        return data;
    } catch (error) {
        console.error('[Error] Failed to load products:', error);
        alert('Failed to load products. Check the console for details.');
        return [];
    }
}

/**
 * Load all categories from the database.
 */
export async function loadCategories() {
    try {
        console.log('[DEBUG] Fetching categories...');
        const { data: categories, error } = await supabase.from('categories').select('*');
        if (error) throw error;

        console.log('[DEBUG] Categories fetched:', categories);
        return categories;
    } catch (error) {
        console.error('[Error] Failed to load categories:', error);
        alert('Failed to load categories. Check the console for details.');
        return [];
    }
}

/**
 * Remove a category from a product.
 * @param {number} productId - Product ID
 * @param {number} categoryId - Category ID
 */
export async function removeCategoryFromProduct(productId, categoryId) {
    try {
        const { error } = await supabase
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
