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
async function initializePage() {
    console.log('[DEBUG] Initializing page...');
    productList = await window.loadProducts(); // Load products into the array

    if (!productList || productList.length === 0) {
        console.warn('[WARN] No products found in the database.');
        return;
    }

    console.log('[DEBUG] Products loaded:', productList);
    currentIndex = 0; // Start with the first product
    displayProduct(productList[currentIndex]); // Display the first product
}

// Initialize the page and attach event listeners
attachEventListeners();
initializePage();
