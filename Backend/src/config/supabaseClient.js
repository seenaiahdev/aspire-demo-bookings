/**
 * supabaseClient.js — Supabase Client Configuration
 * Initializes and exports the Supabase client instance using environment credentials.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('your-project-ref')) {
  console.warn('[Supabase Warning] SUPABASE_URL is not set or using placeholder in .env file');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

module.exports = supabase;
