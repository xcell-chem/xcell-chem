const supabaseUrl = 'https://tjbcucdewwczndkeypey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

async function loadProducts() {
    try {
        console.log('[loadProducts] Fetching products...');
        const { data, error } = await supabaseClient
            .from('products')
            .select(`
                *,
                product_prices (quantity, price),
                product_category (category_id)
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
        alert('Failed to load categories. Check console for details.');
        return [];
    }
}

/**
 * Add a category to a product
 * @param {number} productId - Product ID
 * @param {number} categoryId - Category ID
 */
async function addCategory(productId, categoryId) {
    try {
        const { error } = await supabaseClient
            .from('product_category')
            .insert({ product_id: productId, category_id: categoryId });

        if (error) throw error;

        console.log('[addCategory] Category added to product');
    } catch (error) {
        console.error('[Error] Failed to add category:', error);
    }
}

/**
 * Add a category to the product from the UI
 */
async function addCategoryUI() {
    const categorySelect = document.getElementById('availableCategories');
    const selectedCategoryId = categorySelect.options[categorySelect.selectedIndex]?.value;

    if (!selectedCategoryId) return;

    const currentProductId = productList[currentIndex]?.id;
    if (!currentProductId) {
        console.warn('[WARN] No product selected!');
        return;
    }

    try {
        // Use the addCategory function from db_access.js
        await addCategory(currentProductId, selectedCategoryId);

        console.log('[DEBUG] Category added successfully');
        // Reload products and update the UI
        const updatedProducts = await loadProducts();
        productList = updatedProducts;
        populateProductDetails(productList[currentIndex]);
    } catch (err) {
        console.error('[ERROR] Unexpected error in addCategoryUI:', err);
    }
}

// Ensure the function is globally accessible (if needed)
window.addCategoryUI = addCategoryUI;

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
