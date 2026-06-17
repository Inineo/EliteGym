import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Gunakan fallback URL/Key agar build Next.js tidak error saat env variables tidak diset
const finalUrl = supabaseUrl || 'https://placeholder-ref.supabase.co';
const finalKey = supabaseAnonKey || 'placeholder-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing in environment variables. Using placeholder values for compilation/build.');
}

export const supabase = createClient(finalUrl, finalKey);
