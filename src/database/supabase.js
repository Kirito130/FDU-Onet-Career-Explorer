/**
 * Supabase client configuration and connection utilities
 * Handles database connections and provides helper methods for O*NET data queries
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../../config.js';

/** Promise result when Supabase is not configured (env vars missing on Netlify, etc.) */
const NOT_CONFIGURED = Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
const NOT_CONFIGURED_COUNT = Promise.resolve({ data: null, error: { message: 'Supabase not configured' }, count: 0 });

/** No-op chain: every terminal method returns NOT_CONFIGURED so await supabase.from().select()... works. */
function mockFrom() {
  const end = () => NOT_CONFIGURED;
  const chain = {
    eq: () => chain,
    order: () => chain,
    limit: end,
    single: end,
    or: () => chain,
    gte: () => chain,
    lte: () => chain,
    in: () => chain,
    filter: () => chain
  };
  return {
    select: (...args) => (args[1] && (args[1].count === 'exact' || args[1].head) ? NOT_CONFIGURED_COUNT : chain),
    insert: () => NOT_CONFIGURED,
    update: () => NOT_CONFIGURED,
    delete: () => NOT_CONFIGURED
  };
}

/**
 * Supabase client when credentials exist; otherwise a no-op so the app loads (demo mode).
 * On Netlify: set SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) in Site settings → Environment variables.
 */
const hasCredentials = config.supabase.url && config.supabase.serviceRoleKey;
if (!hasCredentials && typeof process !== 'undefined' && process.env.NETLIFY) {
  console.warn('[Supabase] No SUPABASE_URL or SUPABASE_SECRET_KEY/SUPABASE_SERVICE_ROLE_KEY set. Running in demo mode (no DB data). Set env vars in Netlify → Site configuration → Environment variables, then redeploy.');
}
export const isSupabaseConfigured = hasCredentials;
export const supabase = hasCredentials
  ? createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : { from: mockFrom };

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful, false otherwise
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('occupation_data')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection error:', error.message);
    return false;
  }
}

/**
 * Get occupation data by ONET SOC code
 * @param {string} onetsocCode - The ONET SOC code
 * @returns {Promise<Object|null>} Occupation data or null if not found
 */
export async function getOccupationData(onetsocCode) {
  try {
    const { data, error } = await supabase
      .from('occupation_data')
      .select('*')
      .eq('onetsoc_code', onetsocCode)
      .single();
    
    if (error) {
      console.error('Error fetching occupation data:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching occupation data:', error.message);
    return null;
  }
}

/**
 * Get skills for a specific occupation
 * @param {string} onetsocCode - The ONET SOC code
 * @returns {Promise<Array>} Array of skills data
 */
export async function getOccupationSkills(onetsocCode) {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false });
    
    if (error) {
      console.error('Error fetching skills:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching skills:', error.message);
    return [];
  }
}

/**
 * Get abilities for a specific occupation
 * @param {string} onetsocCode - The ONET SOC code
 * @returns {Promise<Array>} Array of abilities data
 */
export async function getOccupationAbilities(onetsocCode) {
  try {
    const { data, error } = await supabase
      .from('abilities')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false });
    
    if (error) {
      console.error('Error fetching abilities:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching abilities:', error.message);
    return [];
  }
}

/**
 * Get work activities for a specific occupation
 * @param {string} onetsocCode - The ONET SOC code
 * @returns {Promise<Array>} Array of work activities data
 */
export async function getOccupationWorkActivities(onetsocCode) {
  try {
    const { data, error } = await supabase
      .from('work_activities')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false });
    
    if (error) {
      console.error('Error fetching work activities:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching work activities:', error.message);
    return [];
  }
}

/**
 * Get knowledge requirements for a specific occupation
 * @param {string} onetsocCode - The ONET SOC code
 * @returns {Promise<Array>} Array of knowledge data
 */
export async function getOccupationKnowledge(onetsocCode) {
  try {
    const { data, error } = await supabase
      .from('knowledge')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false });
    
    if (error) {
      console.error('Error fetching knowledge:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching knowledge:', error.message);
    return [];
  }
}

/**
 * Get education and training requirements for a specific occupation
 * @param {string} onetsocCode - The ONET SOC code
 * @returns {Promise<Array>} Array of education/training data
 */
export async function getOccupationEducationTraining(onetsocCode) {
  try {
    const { data, error } = await supabase
      .from('education_training_experience')
      .select(`
        *,
        content_model_reference(element_name, description),
        ete_categories(category_description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false });
    
    if (error) {
      console.error('Error fetching education/training:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching education/training:', error.message);
    return [];
  }
}

/**
 * Get job zone information for a specific occupation
 * @param {string} onetsocCode - The ONET SOC code
 * @returns {Promise<Object|null>} Job zone data or null if not found
 */
export async function getOccupationJobZone(onetsocCode) {
  try {
    const { data, error } = await supabase
      .from('job_zones')
      .select(`
        *,
        job_zone_reference(name, experience, education, job_training, examples, svp_range)
      `)
      .eq('onetsoc_code', onetsocCode)
      .single();
    
    if (error) {
      console.error('Error fetching job zone:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching job zone:', error.message);
    return null;
  }
}

export default supabase;
