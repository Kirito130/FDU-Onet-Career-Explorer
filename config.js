/**
 * Configuration file for O*NET Supabase Uploader
 * Copy this file to config.js and fill in your Supabase credentials
 *
 * IMPORTANT: dotenv is loaded here so that .env is read before any process.env
 * usage. In Node ESM, server.js imports run before its body runs, so config.js
 * can be evaluated before dotenv.config() in server.js. Loading dotenv here
 * ensures the current project's .env (SUPABASE_URL, keys, etc.) is used.
 */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Supabase Configuration
  // New keys (recommended): SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY
  // Legacy keys (still supported): SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
  // See: https://supabase.com/docs/guides/api/api-keys
  supabase: {
    url: process.env.SUPABASE_URL || '',
    // Publishable key (sb_publishable_...) – for client-side; legacy: anon JWT
    publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '',
    anonKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '',
    // Secret key (sb_secret_...) – for server-side full access; legacy: service_role JWT
    secretKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },

  // Database Configuration (set DATABASE_URL in .env for direct Postgres; Supabase REST uses supabase.url above)
  database: {
    url: process.env.DATABASE_URL || ''
  },
  
  // Upload Configuration
  upload: {
    batchSize: parseInt(process.env.BATCH_SIZE) || 1000,
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 1000
  },
  
  // File paths
  paths: {
    dataDirectory: './onet_db',
    tableCreationScript: './create-tables.js',
    uploadScript: './upload-data.js'
  }
};

export default config;
