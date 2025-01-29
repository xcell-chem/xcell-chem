import { supabase } from './supabaseClient.js';

/**
 * Upload an image to Supabase Storage
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string|null>} - The URL of the uploaded image or null if failed
 */
export async function uploadImageToSupabase(imageFile) {
    if (!imageFile) {
        console.warn('[DEBUG] No image file selected, skipping upload.');
        return null;
    }

    try {
        console.log('[DEBUG] Uploading image to Supabase...');
        const { data, error } = await supabase.storage
            .from('images')
            .upload(`public/${Date.now()}-${imageFile.name}`, imageFile);

        if (error) {
            console.error('[DEBUG] Image upload error:', error);
            return null;
        }

        console.log('[DEBUG] Image uploaded successfully:', data.path);
        return supabase.storage.from('images').getPublicUrl(data.path).publicUrl;
    } catch (err) {
        console.error('[DEBUG] Unexpected error during image upload:', err);
        return null;
    }
}

/**
 * Save changes to the database.
 */
async function saveChanges() {
    try {
        const data = prepareDataForSave();

        if (selectedImageFile) {
            console.log('[DEBUG] Uploading image to Supabase...');
            data.image_url = await uploadImageToSupabase(selectedImageFile);
        } else {
            console.log('[DEBUG] No image selected, skipping upload.');
        }

        const response = await fetch(data.id ? '/update-record' : '/add-record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert(data.id ? 'Record updated successfully!' : 'New record added successfully!');
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('An error occurred while saving. Check the console.');
    }
}
