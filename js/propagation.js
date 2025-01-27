// Propagation functions for loading and restoring data

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
        li.textContent = category.categories.name;
        li.addEventListener('click', () => removeCategory(category.categories.name));
        categoryList.appendChild(li);
    });
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