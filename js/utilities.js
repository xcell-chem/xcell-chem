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
    };
}

/**
 * Save current product to local storage
 */
function saveToLocalStorage() {
    const product = collectFormData();
    localStorage.setItem('currentProduct', JSON.stringify(product));
    localStorage.setItem('useLocalStorage', true);
}

/**
 * Restore data from local storage
 */
function restoreFromLocalStorage() {
    const savedProduct = localStorage.getItem('currentProduct');
    if (savedProduct) {
        populateProductDetails(JSON.parse(savedProduct));
    }
}