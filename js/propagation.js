let pendingCategories = []; // Array to track pending category changes

/**
 * Restore data from local storage
 */
function restoreFromLocalStorage() {
    const savedProduct = localStorage.getItem('currentProduct');
    if (savedProduct) {
        populateProductDetails(JSON.parse(savedProduct));
    }
}
/**
 * Add a new price row dynamically
 */
function addPriceRow() {
    // Retrieve the current product from localStorage
    const product = JSON.parse(localStorage.getItem('currentProduct')) || {};
    product.product_prices = product.product_prices || [];

    // Add a new empty price row
    product.product_prices.push({ quantity: '', price: '' });

    // Save updated product back to localStorage
    localStorage.setItem('currentProduct', JSON.stringify(product));

    // Update the UI with the new price row
    populatePriceTable(product.product_prices);

    console.log('[DEBUG] Added new price row:', product.product_prices);
}
/**
 * Delete a price row dynamically
 * @param {number} index - Index of the row to delete
 */
function deletePriceRow(index) {
    // Retrieve the current product from localStorage
    const product = JSON.parse(localStorage.getItem('currentProduct')) || {};
    product.product_prices = product.product_prices || [];

    // Remove the row at the specified index
    if (index >= 0 && index < product.product_prices.length) {
        product.product_prices.splice(index, 1);

        // Save updated product back to localStorage
        localStorage.setItem('currentProduct', JSON.stringify(product));

        // Update the UI to reflect the change
        populatePriceTable(product.product_prices);

        console.log('[DEBUG] Deleted price row:', product.product_prices);
    } else {
        console.warn('[WARN] Invalid index for deleting price row:', index);
    }
}

// Expose the function globally if needed
window.deletePriceRow = deletePriceRow;


/**
 * Populate product details into the form
 * @param {Object} product - Product data object
 */
function populateProductDetails(product) {
    document.getElementById('name').value = product.name || '';
    document.getElementById('img').value = product.img || '';
    document.getElementById('imagePreview').src = product.img || '';
    document.getElementById('imagePreview').style.display = product.img ? 'block' : 'none';
    document.getElementById('description').value = product.description || '';
    document.getElementById('shortdescription').value = product.shortdescription || '';
    document.getElementById('active').checked = product.active || false;

    // Save initial price rows to localStorage
    const productWithPrices = {
        ...product,
        product_prices: product.product_prices || []
    };
    localStorage.setItem('currentProduct', JSON.stringify(productWithPrices));

    // Populate the UI
    populateCategoryList(product.product_category || []);
    populatePriceTable(product.product_prices || []);
}


/**
 * Populate selected categories
 * @param {Array} categories - Array of category objects
 */
function populateCategoryList(categories) {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category.name; // Display category name
        li.dataset.id = category.id; // Store category ID
        li.addEventListener('click', () => removeCategoryUI(li));
        categoryList.appendChild(li);
    });
}

/**
 * Add a category to the UI (temporarily)
 */
function addCategoryUI() {
    const categorySelect = document.getElementById('availableCategories');
    const selectedCategoryId = categorySelect.options[categorySelect.selectedIndex]?.value;
    const selectedCategoryName = categorySelect.options[categorySelect.selectedIndex]?.text;

    if (!selectedCategoryId) return;

    // Check if already in pendingCategories or UI
    if (pendingCategories.find(cat => cat.id === parseInt(selectedCategoryId))) {
        console.warn('[WARN] Category already added to the UI.');
        return;
    }

    // Add to the UI
    const categoryList = document.getElementById('categoryList');
    const li = document.createElement('li');
    li.textContent = selectedCategoryName;
    li.dataset.id = selectedCategoryId;
    li.addEventListener('click', () => removeCategoryUI(li));
    categoryList.appendChild(li);

    // Track as pending
    pendingCategories.push({ id: parseInt(selectedCategoryId), name: selectedCategoryName });

    console.log('[DEBUG] Pending categories:', pendingCategories);
}

/**
 * Remove a category from the UI
 * @param {HTMLElement} li - The list item element to remove
 */
function removeCategoryUI(li) {
    const categoryId = parseInt(li.dataset.id);

    pendingCategories = pendingCategories.filter(cat => cat.id !== categoryId);
    li.remove();

    console.log('[DEBUG] Updated pending categories:', pendingCategories);
}

/**
 * Populate product prices
 * @param {Array} prices - Array of price objects
 */
function populatePriceTable(prices) {
    const priceTableContainer = document.getElementById('priceTableContainer');
    priceTableContainer.innerHTML = createPriceTable(prices);
}

/**
 * Create price table HTML
 * @param {Array} prices - Array of price objects
 * @returns {string} - HTML string for the table
 */
function createPriceTable(prices) {
    let tableHtml = '<table><tr><th>Quantity</th><th>Price</th><th>Actions</th></tr>';
    prices.forEach((price, index) => {
        tableHtml += `
            <tr>
                <td><input type="text" value="${price.quantity}" /></td>
                <td><input type="number" value="${price.price}" /></td>
                <td><button onclick="deletePriceRow(${index})">Delete</button></td>
            </tr>
        `;
    });
    tableHtml += '</table>';
    return tableHtml;
}
