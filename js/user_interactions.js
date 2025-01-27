
/
/**
 * Attach event listeners to buttons and inputs
 */
function attachEventListeners() {
    console.log('[DEBUG] Attaching event listeners...');
    document.getElementById('saveRecordButton')?.addEventListener('click', saveRecord);
    document.getElementById('saveNewRecordButton')?.addEventListener('click', saveNewRecord);
}

/**
 * Save a new record
 */
async function saveNewRecord() {
    console.log('[DEBUG] Save New Record button clicked.');
    // Add logic to save a new record
}

/**
 * Render products to the DOM
 * @param {Array} products - List of products fetched from the database
 */
function renderProducts(products) {
    console.log('[DEBUG] Rendering products...', products);

    const productList = document.getElementById('product-list'); // Ensure this ID exists in your HTML
    productList.innerHTML = ''; // Clear the list before adding new items

    products.forEach((product) => {
        const listItem = document.createElement('li');
        listItem.textContent = product.products.name; // Adjust for your data structure
        productList.appendChild(listItem);
    });
}

/**
 * Initialize the page by loading products and setting up event listeners
 */
/**
 * Initialize the page by loading products and setting up event listeners
 */
async function initializePage() {
    console.log('[DEBUG] Initializing page...');
    const products = await window.loadProducts();

    if (!products || !Array.isArray(products)) {
        console.warn('[WARN] Failed to load products or products is not an array.');
        return;
    }

    if (products.length === 0) {
        console.warn('[WARN] No products found in the database.');
    } else {
        renderProducts(products);
    }
}

attachEventListeners();
initializePage();
