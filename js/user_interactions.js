// Functions related to user interactions and button presses

/**
 * Attach event listeners to buttons and inputs
 */
function attachEventListeners() {
    document.getElementById('saveRecordButton').addEventListener('click', saveRecord);
    document.getElementById('saveNewRecordButton').addEventListener('click', saveNewRecord);
    document.getElementById('addCategoryButton').addEventListener('click', addCategory);
    document.getElementById('addPricingRowButton').addEventListener('click', addPricingRow);
    document.getElementById('previousRecordButton').addEventListener('click', showPreviousRecord);
    document.getElementById('nextRecordButton').addEventListener('click', showNextRecord);
    document.getElementById('changeImageButton').addEventListener('click', () => {
        document.getElementById('imageInput').click();
    });
}

/**
 * Add a new pricing row
 */
function addPricingRow() {
    products[currentIndex].product_prices.push({ quantity: '', price: 0 });
    saveToLocalStorage();
    populatePriceTable(products[currentIndex].product_prices);
}

/**
 * Show the previous record
 */
function showPreviousRecord() {
    if (currentIndex > 0) {
        currentIndex--;
        populateProductDetails(products[currentIndex]);
    } else {
        alert('Already at the first record.');
    }
}

/**
 * Show the next record
 */
function showNextRecord() {
    if (currentIndex < products.length - 1) {
        currentIndex++;
        populateProductDetails(products[currentIndex]);
    } else {
        alert('Already at the last record.');
    }
}

/**
 * Handle image preview on file input
 */
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}