// user_interactions.js

// Remove any ES import statements. 
// We'll rely on the global window.createproduct, window.loadproduct, etc.
// db_access.js

// 1) Your actual Supabase project credentials
const supabaseUrl = 'https://tjbcucdewwczndkeypey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ'; // truncated for brevity

// 2) Extract createClient from the global supabase object (loaded by the CDN <script>)
const { createClient } = window.supabase;

// 3) Create a single Supabase client instance
const supabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * Example: load all products from the "products" table.
 * Named "loadProducts" with a capital 'P' to match your usage in user_interactions.js.
 */
window.loadProducts = async function () {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*');

    if (error) {
      console.error('[ERROR] loading products:', error);
      return null;
    }

    console.log('[DEBUG] loaded products:', data);
    return data; // Return so callers can use it
  } catch (err) {
    console.error('[ERROR] unexpected load error:', err);
    return null;
  }
};
document.addEventListener('DOMContentLoaded', () => {
    // Example: button for creating a product
    const createButton = document.getElementById('createProd');
    if (createButton) {
      createButton.addEventListener('click', async () => {
        // Gather product data from form fields, for instance:
        const productData = {
          name: document.getElementById('pname')?.value || 'Default Name',
          category: document.getElementById('pcategory')?.value || 'Misc',
          price: parseFloat(document.getElementById('pprice')?.value) || 0.0,
        };
  
        // Call the global function from db_access.js
        const result = await window.createproduct(productData);
        if (result) {
          alert('Product created successfully! Check the console for details.');
        }
      });
    }
  
    // Example: button for loading a product by ID
    const loadButton = document.getElementById('loadProd');
    if (loadButton) {
      loadButton.addEventListener('click', async () => {
        const productId = document.getElementById('pid')?.value;
        if (!productId) {
          alert('No Product ID provided!');
          return;
        }
  
        const product = await window.loadproduct(productId);
        if (product) {
          alert('Product loaded. Check console for details.');
          // You could also display the product in the DOM...
          console.log('[Loaded Product]', product);
        }
      });
    }
  
    // Example: button for deleting a product by ID
    const deleteButton = document.getElementById('deleteProd');
    if (deleteButton) {
      deleteButton.addEventListener('click', async () => {
        const productId = document.getElementById('pid')?.value;
        if (!productId) {
          alert('No Product ID provided!');
          return;
        }
  
        const result = await window.deleteproduct(productId);
        if (result) {
          alert('Product deleted! Check console for details.');
        }
      });
    }
  
    // Example: button for editing a product by ID
    const editButton = document.getElementById('editProd');
    if (editButton) {
      editButton.addEventListener('click', async () => {
        const productId = document.getElementById('pid')?.value;
        const updatedName = document.getElementById('pname')?.value;
        const updatedPrice = parseFloat(document.getElementById('pprice')?.value);
  
        if (!productId) {
          alert('No Product ID provided for editing!');
          return;
        }
  
        const updates = {};
        if (updatedName) updates.name = updatedName;
        if (!isNaN(updatedPrice)) updates.price = updatedPrice;
  
        const result = await window.editproduct(productId, updates);
        if (result) {
          alert('Product updated! Check console for details.');
        }
      });
    }
  
    // Example: button for "saving" a product (could be the same as create)
    const saveButton = document.getElementById('saveProd');
    if (saveButton) {
      saveButton.addEventListener('click', async () => {
        try {
          const productData = {
            name: document.getElementById('pname')?.value || 'Default Name',
            price: parseFloat(document.getElementById('pprice')?.value) || 0.0,
          };
  
          await window.saveProductToDB(productData);
          alert('Product saved successfully!');
        } catch (e) {
          alert('Error saving product. Check console.');
          console.error(e);
        }
      });
    }
  });
  