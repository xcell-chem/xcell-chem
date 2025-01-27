// Functions to access the database

const supabaseUrl = 'https://tjbcucdewwczndkeypey.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/**
 * Load products from the database
 */
async function loadProducts() {
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select(`
                *,
                product_prices (quantity, price),
                product_category (categories (name))
            `);

        if (error) throw error;

        products = data;
        if (products.length > 0) {
            populateProductDetails(products[currentIndex]);
        }
    } catch (error) {
        console.error('[Error] Failed to load products:', error);
    }
}

/**
 * Load categories from the database
 */
async function loadCategories() {
    try {
        const { data: categories, error } = await supabaseClient.from('categories').select('*');

        if (error) throw error;

        const categoryDropdown = document.getElementById('availableCategories');
        categoryDropdown.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('[Error] Failed to load categories:', error);
    }
}

/**
 * Save record to the database
 */
async function saveRecord() {
    const product = collectFormData();
    saveToLocalStorage();
    try {
        const { error } = await supabaseClient
            .from('products')
            .update(product)
            .eq('id', products[currentIndex].id);

        if (error) throw error;
        alert('Record saved successfully!');
    } catch (error) {
        console.error('[saveRecord] Failed to save record:', error);
    }
}

/**
 * Save a new record to the database
 */
async function saveNewRecord() {
    const product = collectFormData();
    try {
        const { data, error } = await supabaseClient.from('products').insert(product);

        if (error) throw error;

        products.push(data[0]);
        currentIndex = products.length - 1;
        saveToLocalStorage();
        populateProductDetails(data[0]);
        alert('New record saved successfully!');
    } catch (error) {
        console.error('[saveNewRecord] Failed to save new record:', error);
    }
}

/**
 * Add a new category to the product
 */
async function addCategory() {
    const categoryId = document.getElementById('availableCategories').value;
    const productId = products[currentIndex].id;

    try {
        const { error } = await supabaseClient
            .from('product_category')
            .insert([{ product_id: productId, category_id: categoryId }]);

        if (error) throw error;

        saveToLocalStorage();
        await loadProducts();
        populateProductDetails(products[currentIndex]);
    } catch (error) {
        console.error('[addCategory] Failed to add category:', error);
    }
}