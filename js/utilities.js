// Utility functions

/**
 * Collect data from form fields
 * @returns {Object} - Product data object
 */
function collectFormData() {
    return {
        name: document.getElementById('name').value,
        img: document.getElementById('img').value,
        description: document.getElementById('description').value,
        shortdescription: document.getElementById('shortdescription').value,
        active: document.getElementById('active').checked,
        product_category: [], // Add logic to collect categories if required
        product_prices: [] // Add logic to collect prices if required
    };
}

/**
 * Save current product to local storage
 */
function saveToLocalStorage() {
    const product = collectFormData();
    localStorage.setItem('currentProduct', JSON.stringify(product));
    console.log('[DEBUG] Product saved to localStorage:', product);
}
