/**
 * Deployment Configuration for FDU Careers Exploration
 * This file ensures proper configuration for production deployment
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
// Server needs: SUPABASE_URL + (SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY)
const hasSupabaseUrl = !!process.env.SUPABASE_URL;
const hasServerKey = !!(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
const hasDatabaseUrl = !!process.env.DATABASE_URL;

if (!hasSupabaseUrl || !hasServerKey) {
  console.error('❌ Missing required Supabase env: SUPABASE_URL and either SUPABASE_SECRET_KEY (new) or SUPABASE_SERVICE_ROLE_KEY (legacy).');
  process.exit(1);
}
if (!hasDatabaseUrl) {
  console.error('❌ Missing required environment variable: DATABASE_URL');
  process.exit(1);
}

// Export configuration for use in other files (supports new and legacy keys)
export const deploymentConfig = {
  supabase: {
    url: process.env.SUPABASE_URL,
    publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY,
    anonKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY,
    secretKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceRoleKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  database: {
    url: process.env.DATABASE_URL
  },
  app: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'production'
  }
};

console.log('✅ Deployment configuration loaded successfully');
console.log(`🌐 Environment: ${deploymentConfig.app.nodeEnv}`);
console.log(`🔗 Supabase URL: ${deploymentConfig.supabase.url}`);
console.log(`🚀 Server will start on port: ${deploymentConfig.app.port}`);

export default deploymentConfig;
