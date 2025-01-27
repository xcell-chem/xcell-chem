let productList = []; // Array to store all products
let currentIndex = 0; // Index of the currently displayed product

/**
 * Attach event listeners to buttons and inputs
 */
function attachEventListeners() {
    console.log('[DEBUG] Attaching event listeners...');
    document.getElementById('nextButton')?.addEventListener('click', showNextProduct);
    document.getElementById('prevButton')?.addEventListener('click', showPreviousProduct);
}
// user_interactions.js

/**
 * Example function that triggers loadproduct
 * when a user clicks a button or some event occurs.
 */
function onLoadProducts() {
    // Simply call loadproduct (or window.loadproduct)
    // Ensure db_access.js was loaded first in your HTML
    window.loadproduct()
  }
  
  // Suppose you bind to a button click:
 // document.getElementById('load-button').addEventListener('click', onLoadProducts)
  
/**
 * Display a single product on the page
 * @param {Object} product - The product object to display
 */
function displayProduct(product) {
    console.log('[DEBUG] Displaying product:', product);

    // Update the page elements with product details
    document.getElementById('product-name').textContent = product.name || 'No Name';
    document.getElementById('product-description').textContent = product.description || 'No Description';
}

/**
 * Show the next product
 */
function showNextProduct() {
    if (productList.length === 0) {
        console.warn('[WARN] No products to display.');
        return;
    }

    currentIndex = (currentIndex + 1) % productList.length; // Cycle through the list
    displayProduct(productList[currentIndex]);
}

/**
 * Show the previous product
 */
function showPreviousProduct() {
    if (productList.length === 0) {
        console.warn('[WARN] No products to display.');
        return;
    }

    currentIndex = (currentIndex - 1 + productList.length) % productList.length; // Cycle backward
    displayProduct(productList[currentIndex]);
}

/**
 * Initialize the page by loading products and setting up event listeners
 */
console.log('[DEBUG] window.loadProducts:', window.loadProducts);
async function initializePage() {
    console.log('[DEBUG] Initializing page...');
    try {
        const products = await window.loadProducts(); // Ensure this function is accessible

        if (!products || !Array.isArray(products)) {
            console.warn('[WARN] Failed to load products or products is not an array.');
            return;
        }

        if (products.length === 0) {
            console.warn('[WARN] No products found in the database.');
        } else {
            renderProducts(products); // Ensure renderProducts is defined correctly
        }
    } catch (error) {
        console.error('[ERROR] An error occurred while initializing the page:', error);
    }
}


// Initialize the page and attach event listeners
attachEventListeners();
initializePage();
