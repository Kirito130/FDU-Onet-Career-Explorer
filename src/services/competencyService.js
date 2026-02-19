/**
 * Competency Service
 * Handles NACE competency matching with O*NET job roles
 * Maps user-selected competencies to relevant career opportunities
 */

import { supabase } from '../database/supabase.js';

/**
 * Get job roles that match the selected competency combination
 * @param {Array<string>} competencies - Array of 3 selected competencies
 * @param {number} limit - Maximum number of results to return (default: 20)
 * @returns {Promise<Array>} Array of matching job roles with match scores
 */
export async function getJobsByCompetencies(competencies, limit = 20) {
  try {
    // Sort competencies to ensure consistent combination key
    const sortedCompetencies = [...competencies].sort();
    const combinationKey = sortedCompetencies.join(',');
    
    // Query the precomputed mapping table
    const { data, error } = await supabase
      .from('competency_job_mappings')
      .select(`
        *,
        occupation_data(onetsoc_code, title, description)
      `)
      .eq('competency_combination', combinationKey)
      .order('match_score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching jobs by competencies:', error.message);
      return [];
    }
    
    // Transform data to include occupation details
    return data.map(item => ({
      onetsoc_code: item.onetsoc_code,
      title: item.occupation_data?.title || 'Unknown Title',
      description: item.occupation_data?.description || 'No description available',
      match_score: Math.round(item.match_score)
    }));
    
  } catch (error) {
    console.error('Error in getJobsByCompetencies:', error.message);
    return [];
  }
}

/**
 * Get detailed job information including top matching competencies
 * @param {string} onetsocCode - ONET SOC code for the job
 * @returns {Promise<Object|null>} Detailed job information or null if not found
 */
export async function getDetailedJobInfo(onetsocCode) {
  try {
    // Get basic occupation data
    const { data: occupationData, error: occupationError } = await supabase
      .from('occupation_data')
      .select('*')
      .eq('onetsoc_code', onetsocCode)
      .single();
    
    if (occupationError) {
      console.error('Error fetching occupation data:', occupationError.message);
      return null;
    }
    
    // Get job zone information
    const { data: jobZoneData } = await supabase
      .from('job_zones')
      .select(`
        *,
        job_zone_reference(name, experience, education, job_training, examples, svp_range)
      `)
      .eq('onetsoc_code', onetsocCode)
      .single();
    
    // Get top matching competencies for this job
    const { data: competencyMatches } = await supabase
      .from('job_competency_matches')
      .select(`
        *,
        nace_competencies(competency_name)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('match_strength', { ascending: false })
      .limit(3);
    
    // Get top skills
    const { data: skillsData } = await supabase
      .from('skills')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false })
      .limit(10);
    
    // Get top knowledge areas
    const { data: knowledgeData } = await supabase
      .from('knowledge')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false })
      .limit(10);
    
    // Get work activities
    const { data: workActivitiesData } = await supabase
      .from('work_activities')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false })
      .limit(10);
    
    // Get education and training requirements
    const { data: educationData } = await supabase
      .from('education_training_experience')
      .select(`
        *,
        content_model_reference(element_name, description),
        ete_categories(category_description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false })
      .limit(10);
    
    return {
      onetsoc_code: occupationData.onetsoc_code,
      title: occupationData.title,
      description: occupationData.description,
      job_zone: jobZoneData?.job_zone_reference || null,
      top_competencies: competencyMatches?.map(match => ({
        competency_name: match.nace_competencies?.competency_name || 'Unknown',
        match_strength: Math.round(match.match_strength)
      })) || [],
      skills: skillsData || [],
      knowledge: knowledgeData || [],
      work_activities: workActivitiesData || [],
      education_training: educationData || []
    };
    
  } catch (error) {
    console.error('Error in getDetailedJobInfo:', error.message);
    return null;
  }
}

/**
 * Get all available NACE competencies
 * @returns {Promise<Array>} Array of NACE competencies
 */
export async function getAllCompetencies() {
  try {
    const { data, error } = await supabase
      .from('nace_competencies')
      .select('*')
      .order('competency_name');
    
    if (error) {
      console.error('Error fetching competencies:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllCompetencies:', error.message);
    return [];
  }
}

/**
 * Check if competency mappings exist in the database
 * @returns {Promise<boolean>} True if mappings exist, false otherwise
 */
export async function checkCompetencyMappingsExist() {
  try {
    const { count, error } = await supabase
      .from('competency_job_mappings')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking competency mappings:', error.message);
      return false;
    }
    
    return count > 0;
  } catch (error) {
    console.error('Error in checkCompetencyMappingsExist:', error.message);
    return false;
  }
}

/**
 * Get statistics about competency mappings
 * @returns {Promise<Object>} Statistics object
 */
export async function getCompetencyMappingStats() {
  try {
    const { count: totalMappings, error: mappingsError } = await supabase
      .from('competency_job_mappings')
      .select('*', { count: 'exact', head: true });
    
    const { count: uniqueCombinations, error: combinationsError } = await supabase
      .from('competency_job_mappings')
      .select('competency_combination', { count: 'exact', head: true });
    
    const { count: totalJobs, error: jobsError } = await supabase
      .from('occupation_data')
      .select('*', { count: 'exact', head: true });
    
    if (mappingsError || combinationsError || jobsError) {
      console.error('Error fetching mapping stats:', mappingsError || combinationsError || jobsError);
      return null;
    }
    
    return {
      totalMappings: totalMappings || 0,
      uniqueCombinations: uniqueCombinations || 0,
      totalJobs: totalJobs || 0
    };
  } catch (error) {
    console.error('Error in getCompetencyMappingStats:', error.message);
    return null;
  }
}

export default {
  getJobsByCompetencies,
  getDetailedJobInfo,
  getAllCompetencies,
  checkCompetencyMappingsExist,
  getCompetencyMappingStats
};
