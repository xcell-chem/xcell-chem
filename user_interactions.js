
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
async function initializePage() {
    console.log('[DEBUG] Initializing page...');
    const products = await loadProducts();

    if (products.length === 0) {
        console.warn('[WARN] No products found in the database.');
    } else {
        console.log('[DEBUG] Rendering products to the page...', products);
        renderProducts(products); // Ensure renderProducts function exists and works
    }
}

attachEventListeners();
initializePage();
