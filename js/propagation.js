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
 * Add a category to the list
 */
/**
 * Add a category to the product
 */
async function addCategory() {
    const categorySelect = document.getElementById('availableCategories');
    const selectedCategoryId = categorySelect.options[categorySelect.selectedIndex].value;

    if (!selectedCategoryId) return;

    const currentProductId = productList[currentIndex]?.id;
    if (!currentProductId) {
        console.warn('[WARN] No product selected!');
        return;
    }

    try {
        // Insert the new category by ID into the product_category table
        const { error } = await supabaseClient
            .from('product_category')
            .insert({ product_id: currentProductId, category_id: parseInt(selectedCategoryId, 10) });

        if (error) {
            console.error('[ERROR] Adding category:', error);
            return;
        }

        // Refresh the selected categories list
        await loadCategories(currentProductId);
    } catch (err) {
        console.error('[ERROR] Unexpected error in addCategory:', err);
    }
}

async function removeCategory(categoryName) {
    const currentProductId = productList[currentIndex]?.id;
    if (!currentProductId) {
        console.warn('[WARN] No product selected!');
        return;
    }

    try {
        // Delete the category for the current product
        const { error } = await supabaseClient
            .from('product_category')
            .delete()
            .eq('product_id', currentProductId)
            .eq('category_name', categoryName);

        if (error) {
            console.error('[ERROR] Removing category:', error);
            return;
        }

        // Refresh the selected categories list
        await loadCategories(currentProductId);
    } catch (err) {
        console.error('[ERROR] Unexpected error in removeCategory:', err);
    }
}

/**
 * Populate selected categories
 * @param {Array} categories - Array of category objects (e.g., [{ id: 1, name: 'Category 1' }])
 */
function populateCategoryList(categories) {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category.name;
        li.addEventListener('click', () => removeCategory(category.name));
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

function addPriceRow() {
    const product = JSON.parse(localStorage.getItem('currentProduct')) || {};
    product.product_prices = product.product_prices || [];

    // Add a default price row
    product.product_prices.push({ quantity: '', price: '' });

    // Save to localStorage and update the DOM
    localStorage.setItem('currentProduct', JSON.stringify(product));
    populatePriceTable(product.product_prices);
}
/**
 * Delete a price row and reload
 * @param {number} index - Index of the row to delete
 */
function deletePriceRow(index) {
    const product = JSON.parse(localStorage.getItem('currentProduct'));
    product.product_prices.splice(index, 1);
    localStorage.setItem('currentProduct', JSON.stringify(product));
    localStorage.setItem('reloadFlag', 'deletePriceRow');
    window.location.reload();
}
