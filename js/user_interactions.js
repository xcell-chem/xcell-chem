let productList = [];
let currentIndex = 0;

/**
 * Attach event listeners to buttons and inputs
 */
function attachEventListeners() {
    document.getElementById('addCategoryButton')?.addEventListener('click', addCategoryUI);
    document.getElementById('saveRecordButton')?.addEventListener('click', saveChanges);
    document.getElementById('previousRecordButton')?.addEventListener('click', showPreviousProduct);
    document.getElementById('nextRecordButton')?.addEventListener('click', showNextProduct);
    document.getElementById('addPricingRowButton')?.addEventListener('click', addPriceRow);
    document.getElementById('changeImageButton')?.addEventListener('click', changeImage); // New event listener
}
/**
 * Save all changes to the database
 */
async function saveChanges() {
    const currentProductId = productList[currentIndex]?.id;
    if (!currentProductId) {
        console.warn('[WARN] No product selected!');
        return;
    }

    const product = JSON.parse(localStorage.getItem('currentProduct'));

    try {
        // Update image and description in the products table
        const { error: productError } = await supabaseClient
            .from('products')
            .update({
                img: product.img,
                description: product.description,
                shortdescription: product.shortdescription,
                active: product.active
            })
            .eq('id', currentProductId);

        if (productError) throw productError;

        console.log('[DEBUG] Product details updated successfully.');

        // Save pending categories
        for (const category of pendingCategories) {
            await addCategory(currentProductId, category.id);
        }

        console.log('[DEBUG] Categories updated successfully.');

        // Save price rows
        await supabaseClient
            .from('product_prices')
            .delete()
            .eq('product_id', currentProductId); // Remove existing prices

        for (const price of product.product_prices) {
            await supabaseClient
                .from('product_prices')
                .insert({
                    product_id: currentProductId,
                    quantity: price.quantity,
                    price: price.price
                });
        }

        console.log('[DEBUG] Price rows updated successfully.');

        alert('Changes saved successfully!');
        pendingCategories = []; // Clear pending categories
    } catch (error) {
        console.error('[ERROR] Failed to save changes:', error);
        alert('Failed to save changes. Check the console for details.');
    }
}


/**
 * Save all pending categories to the database
 */
async function saveCategories() {
    const currentProductId = productList[currentIndex]?.id;
    if (!currentProductId) {
        console.warn('[WARN] No product selected!');
        return;
    }

    try {
        for (const category of pendingCategories) {
            await addCategory(currentProductId, category.id);
        }

        console.log('[DEBUG] Categories saved successfully.');
        pendingCategories = [];
    } catch (error) {
        console.error('[ERROR] Failed to save categories:', error);
    }
}

/**
 * Show the next product
 */
function showNextProduct() {
    if (productList.length === 0) return;

    currentIndex = (currentIndex + 1) % productList.length;
    populateProductDetails(productList[currentIndex]);
}

/**
 * Show the previous product
 */
function showPreviousProduct() {
    if (productList.length === 0) return;

    currentIndex = (currentIndex - 1 + productList.length) % productList.length;
    populateProductDetails(productList[currentIndex]);
}

/**
 * Initialize the page by loading products and categories
 */
async function initializePage() {
    try {
        console.log('[initializePage] Initializing...');

        // Load products
        productList = await loadProducts();
        if (productList.length > 0) {
            populateProductDetails(productList[0]);
        }

        // Load categories for the dropdown
        const categories = await loadCategories();
        const categorySelect = document.getElementById('availableCategories');
        categorySelect.innerHTML = categories
            .map(category => `<option value="${category.id}">${category.name}</option>`)
            .join('');
    } catch (error) {
        console.error('[ERROR] Failed to initialize page:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    attachEventListeners();
    initializePage();
});


document.addEventListener('DOMContentLoaded', () => {
    attachEventListeners();
    initializePage();
});
