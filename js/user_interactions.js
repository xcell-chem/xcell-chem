let productList = [];
let currentIndex = 0;

/**
 * Attach event listeners to buttons and inputs
 */
function attachEventListeners() {
    document.getElementById('addCategoryButton')?.addEventListener('click', addCategoryUI);
    document.getElementById('saveRecordButton')?.addEventListener('click', saveCategories);
    document.getElementById('previousRecordButton')?.addEventListener('click', showPreviousProduct);
    document.getElementById('nextRecordButton')?.addEventListener('click', showNextProduct);
    document.getElementById('addPricingRowButton')?.addEventListener('click', addPriceRow);
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
    productList = await loadProducts();
    if (productList.length > 0) {
        populateProductDetails(productList[0]);
    }

    const categories = await loadCategories();
    const categorySelect = document.getElementById('availableCategories');
    categorySelect.innerHTML = categories
        .map(category => `<option value="${category.id}">${category.name}</option>`)
        .join('');
}

document.addEventListener('DOMContentLoaded', () => {
    attachEventListeners();
    initializePage();
});
