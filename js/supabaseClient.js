
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.48.1';


export const SUPABASE_URL = 'https://tjbcucdewwczndkeypey.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYmN1Y2Rld3djem5ka2V5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MzUwMzcsImV4cCI6MjA1MzUxMTAzN30.iBm2u7xY5qRQT6gOQw7OwAYTENJh49B9lI0YtLuKJAQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
