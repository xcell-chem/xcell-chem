// Functions to access the database

const supabaseUrl = 'https://tjbcucdewwczndkeypey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/**
 * Load products from the database
 */
/**
 * Load products from the database
 */
async function loadProducts() {
    console.log('[DEBUG] Attempting to load products from the database...');
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select(`
                *,
                product_prices (quantity, price),
                product_category (name) -- Adjusted relationship name
            `);

        if (error) {
            console.error('[ERROR] Failed to load products:', error);
            return []; // Return an empty array on error
        }

        console.log('[DEBUG] Products fetched successfully:', data);
        return data;
    } catch (err) {
        console.error('[ERROR] Unexpected error while loading products:', err);
        return [];
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