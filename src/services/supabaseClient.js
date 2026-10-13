import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from Vite environment variables or localStorage (for runtime config in browser)
const getEnvOrStored = (key, fallback = '') => {
  try {
    return import.meta.env[key] || localStorage.getItem(`faneelo_${key.toLowerCase()}`) || fallback;
  } catch {
    return fallback;
  }
};

const supabaseUrl = getEnvOrStored('VITE_SUPABASE_URL', '');
const supabaseAnonKey = getEnvOrStored('VITE_SUPABASE_ANON_KEY', '');

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('placeholder')
  );
};

export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const updateSupabaseCredentials = (url, anonKey) => {
  try {
    if (url) localStorage.setItem('faneelo_vite_supabase_url', url.trim());
    if (anonKey) localStorage.setItem('faneelo_vite_supabase_anon_key', anonKey.trim());
    window.location.reload();
  } catch (e) {
    console.error('Failed to update credentials:', e);
  }
};
