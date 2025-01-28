
    // Updated user_interactions.js with correct save logic and image upload functionality

    // Function to handle image selection and upload
    let selectedImageFile = null; // To store the selected image file

    document.getElementById('changeImageButton')?.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                selectedImageFile = file;
                alert(`Selected image: ${file.name}`);
            }
        };
        fileInput.click();
    });

    // Function to save changes (update record, upload image, or insert new record)
    async function saveChanges() {
        try {
            const data = prepareDataForSave(); // Prepare the data to be saved

            if (selectedImageFile) {
                const imageUrl = await uploadImageToSupabase(selectedImageFile);
                data.image_url = imageUrl; // Add the image URL to the record data
            }

            if (data.id) {
                // Update existing record
                const response = await fetch('/update-record', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Record updated successfully!');
                } else {
                    alert(`Failed to update record: ${result.message}`);
                }
            } else {
                // Insert new record
                const response = await fetch('/add-record', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                if (response.ok) {
                    alert('New record added successfully!');
                } else {
                    alert(`Failed to add record: ${result.message}`);
                }
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('An error occurred while saving changes. Please check the console.');
        }
    }

    // Function to prepare data for saving
    function prepareDataForSave() {
        const id = document.getElementById('recordId')?.value; // Example of capturing a unique ID
        const name = document.getElementById('recordName')?.value;
        const description = document.getElementById('recordDescription')?.value;

        // Add more fields as necessary based on your form

        return {
            id: id ? parseInt(id, 10) : null, // Convert to integer if present
            name,
            description,
            // Add additional fields here
        };
    }

    // Function to upload an image to Supabase Storage
    async function uploadImageToSupabase(file) {
        const SUPABASE_URL = 'https://tjbcucdewwczndkeypey.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ';

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        const { data, error } = await supabase.storage
            .from('images') // Replace with your Supabase storage bucket name
            .upload(`public/${Date.now()}_${file.name}`, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error('Error uploading image:', error);
            throw new Error('Image upload failed.');
        }

        const { publicUrl } = supabase.storage.from('images').getPublicUrl(data.path);
        return publicUrl;
    }
    