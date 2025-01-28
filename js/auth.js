
import { SUPABASE_URL, SUPABASE_KEY } from './supabaseConfig.js';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Check login status
async function checkLoginStatus() {
    const user = supabase.auth.user();
    if (!user) {
        openLoginPopup();
    } else {
        console.log('User logged in:', user);
    }
}

// Open login popup
async function openLoginPopup() {
    const { user, error } = await supabase.auth.signIn({
        provider: 'google',
    });
    if (error) {
        console.error('Login error:', error);
        alert('Failed to log in. Please try again.');
    } else {
        console.log('User logged in:', user);
        await registerUserInDatabase(user);
    }
}

// Register user in database
async function registerUserInDatabase(user) {
    const { data, error } = await supabase
        .from('users')
        .upsert({
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name,
        });
    if (error) {
        console.error('Error registering user:', error);
    } else {
        console.log('User registered in database:', data);
    }
}

// Export functions for reuse
export { checkLoginStatus, openLoginPopup, registerUserInDatabase };
