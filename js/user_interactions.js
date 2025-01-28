let productList = []; // Array to store all products
let currentIndex = 0; // Index of the currently displayed product

/**
 * Attach event listeners to buttons and inputs
 */
function attachEventListeners() {
    console.log('[DEBUG] Attaching event listeners...');
    document.getElementById('previousRecordButton')?.addEventListener('click', () => {
        if (productList.length === 0) return;

        currentIndex = (currentIndex - 1 + productList.length) % productList.length;
        populateProductDetails(productList[currentIndex]);
    });

    document.getElementById('nextRecordButton')?.addEventListener('click', () => {
        if (productList.length === 0) return;

        currentIndex = (currentIndex + 1) % productList.length;
        populateProductDetails(productList[currentIndex]);
    });

    document.getElementById('saveRecordButton')?.addEventListener('click', saveToLocalStorage);
    document.getElementById('addPricingRowButton')?.addEventListener('click', addPriceRow);
}

/**
 * Initialize the page by loading products and setting up event listeners
 */
async function initializePage() {
    console.log('[DEBUG] initializePage called');

    const reloadFlag = localStorage.getItem('reloadFlag');
    if (reloadFlag) {
        console.log(`[DEBUG] Page reloaded due to: ${reloadFlag}`);
        restoreFromLocalStorage();
        localStorage.removeItem('reloadFlag');
        return;
    }

    const products = await window.loadProducts();

    if (products) {
        console.log('[DEBUG] products found:', products);
        productList = products;

        if (products.length > 0) {
            populateProductDetails(products[0]);
        }
    } else {
        console.warn('[WARN] No products or an error occurred while loading.');
    }

    // Preload categories for the dropdown
    preloadCategories();
}

/**
 * Preload categories into the dropdown
 */
function preloadCategories() {
    const categories = [
        'Category 1',
        'Category 2',
        'Category 3' // Replace with categories fetched from the database if needed
    ];

    const categorySelect = document.getElementById('availableCategories');
    categorySelect.innerHTML = categories
        .map(category => `<option value="${category}">${category}</option>`)
        .join('');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('[DEBUG] DOMContentLoaded, calling initializePage()...');
    attachEventListeners();
    initializePage();
});
