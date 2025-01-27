import { loadProducts } from './db_access.js';
// Functions related to user interactions and button presses

/**
 * Attach event listeners to buttons and inputs
 */
function attachEventListeners() {
    console.log('[DEBUG] Attaching event listeners...');
    document.getElementById('saveRecordButton')?.addEventListener('click', saveRecord);
    document.getElementById('saveNewRecordButton')?.addEventListener('click', saveNewRecord);
    // Add more event listeners as needed
}

/**
 * Save a new record
 */
async function saveRecord() {
    console.log('[DEBUG] Save Record button clicked.');
    // Implement the logic to save the record
}

/**
 * Load products and render them to the DOM
 */
/**
 * Load products and render them to the DOM
 */
async function initializePage() {
    console.log('[DEBUG] Initializing page...');
    const products = await loadProducts();

    if (!products || !Array.isArray(products)) {
        console.warn('[WARN] Failed to load products or products is not an array.');
        return;
    }

    if (products.length === 0) {
        console.warn('[WARN] No products found in the database.');
    } else {
        console.log('[DEBUG] Rendering products to the page...');
        renderProducts(products); // Call renderProducts here
    }
}

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear the list

    products.forEach((product) => {
        const listItem = document.createElement('li');
        listItem.textContent = product.products.name; // Access the related product name
        productList.appendChild(listItem);
    });
}


attachEventListeners();
initializePage();
