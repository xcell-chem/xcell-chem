import { createClient } from "../node_modules/@supabase/supabase-js/dist/module/index.js";

const supabaseUrl = "https://tjbcucdewwczndkeypey.supabase.co";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";  // Replace with your actual key, preferably from environment variables

export const supabase = createClient(supabaseUrl, supabaseKey);
