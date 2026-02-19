/**
 * Supabase client configuration and connection utilities
 * Handles database connections and provides helper methods for O*NET data queries
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../../config.js';

// Ensure .env was loaded and current project credentials are set (config.js loads dotenv)
// Use new secret key (SUPABASE_SECRET_KEY) or legacy service_role (SUPABASE_SERVICE_ROLE_KEY)
if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  throw new Error(
    'Missing Supabase credentials. Set SUPABASE_URL and either SUPABASE_SECRET_KEY (new) or SUPABASE_SERVICE_ROLE_KEY (legacy) in .env. ' +
    'See https://supabase.com/docs/guides/api/api-keys'
  );
}

/**
 * Create Supabase client instance
 * Uses service role key for full database access
 */
export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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
