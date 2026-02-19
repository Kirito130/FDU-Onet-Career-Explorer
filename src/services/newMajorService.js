/**
 * New Major Service - Simplified Structure
 * Works with the new 3-table database design
 */

import { supabase } from '../database/supabase.js';

/**
 * Get job roles that match the selected course major
 * @param {string} majorName - Selected course major name
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} Array of matching job roles with match scores
 */
export async function getJobsByMajor(majorName, limit = null) {
  try {
    // Query jobs that match this major
    let query = supabase
      .from('job_major_mappings')
      .select(`
        *,
        occupation_data(onetsoc_code, title, description)
      `)
      .eq('major_name', majorName)
      .order('match_score', { ascending: false });
    
    // Only apply limit if specified
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching jobs by major:', error.message);
      return [];
    }
    
    // Transform data to include occupation details
    return data.map(item => ({
      onetsoc_code: item.onetsoc_code,
      title: item.occupation_data?.title || 'Unknown Title',
      description: item.occupation_data?.description || 'No description available',
      match_score: Math.round(Math.min(item.match_score, 100)) // Cap at 100%
    }));
    
  } catch (error) {
    console.error('Error in getJobsByMajor:', error.message);
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
    
    // Get NACE competency mappings
    const { data: naceMapping } = await supabase
      .from('job_nace_mappings')
      .select('*')
      .eq('onetsoc_code', onetsocCode)
      .single();
    
    // Get all competency scores for this job
    const { data: competencyScores } = await supabase
      .from('job_competency_scores')
      .select('*')
      .eq('onetsoc_code', onetsocCode)
      .order('score', { ascending: false });
    
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
    
    // Format top competencies
    const topCompetencies = [];
    if (naceMapping) {
      topCompetencies.push(
        { competency_name: naceMapping.competency_1, match_strength: naceMapping.competency_1_score },
        { competency_name: naceMapping.competency_2, match_strength: naceMapping.competency_2_score },
        { competency_name: naceMapping.competency_3, match_strength: naceMapping.competency_3_score }
      );
    }
    
    return {
      onetsoc_code: occupationData.onetsoc_code,
      title: occupationData.title,
      description: occupationData.description,
      job_zone: jobZoneData?.job_zone_reference || null,
      top_competencies: topCompetencies,
      skills: skillsData || [],
      knowledge: knowledgeData || [],
      work_activities: workActivitiesData || [],
      education_training: educationData || [],
      all_competency_scores: competencyScores || []
    };
    
  } catch (error) {
    console.error('Error in getDetailedJobInfo:', error.message);
    return null;
  }
}

/**
 * Get all available course majors
 * @returns {Promise<Array>} Array of course majors
 */
export async function getAllMajors() {
  return [
    'Arts',
    'Social Sciences',
    'Environmental Studies',
    'Hospitality & Tourism Management',
    'Applied Technology',
    'Business',
    'Communications',
    'Digital Media Arts',
    'Healthcare Administration',
    'Homeland Security',
    'Human Resource Management',
    'Liberal Studies',
    'Public Administration',
    'Technology',
    'Sustainability'
  ];
}

/**
 * Check if major mappings exist in the database
 * @returns {Promise<boolean>} True if mappings exist, false otherwise
 */
export async function checkMajorMappingsExist() {
  try {
    const { count, error } = await supabase
      .from('job_major_mappings')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking major mappings:', error.message);
      return false;
    }
    
    return count > 0;
  } catch (error) {
    console.error('Error in checkMajorMappingsExist:', error.message);
    return false;
  }
}

/**
 * Get statistics about major mappings
 * @returns {Promise<Object>} Statistics object
 */
export async function getMajorMappingStats() {
  try {
    const { count: totalMappings, error: mappingsError } = await supabase
      .from('job_major_mappings')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalJobs, error: jobsError } = await supabase
      .from('occupation_data')
      .select('*', { count: 'exact', head: true });
    
    if (mappingsError || jobsError) {
      console.error('Error fetching mapping stats:', mappingsError || jobsError);
      return null;
    }
    
    return {
      totalMappings: totalMappings || 0,
      totalJobs: totalJobs || 0,
      coveragePercentage: totalJobs > 0 ? Math.round((totalMappings / totalJobs) * 100) : 0
    };
  } catch (error) {
    console.error('Error in getMajorMappingStats:', error.message);
    return null;
  }
}

/**
 * Get job roles by major with additional filtering options
 * @param {string} majorName - Selected course major name
 * @param {Object} filters - Additional filters (minScore, maxResults, etc.)
 * @returns {Promise<Array>} Array of matching job roles
 */
export async function getJobsByMajorWithFilters(majorName, filters = {}) {
  try {
    const {
      minScore = 0,
      maxResults = 20
    } = filters;
    
    // Query jobs that match this major with filters
    const { data, error } = await supabase
      .from('job_major_mappings')
      .select(`
        *,
        occupation_data(onetsoc_code, title, description)
      `)
      .eq('major_name', majorName)
      .gte('match_score', minScore)
      .order('match_score', { ascending: false })
      .limit(maxResults);
    
    if (error) {
      console.error('Error fetching jobs by major with filters:', error.message);
      return [];
    }
    
    // Transform data to include occupation details
    return data.map(item => ({
      onetsoc_code: item.onetsoc_code,
      title: item.occupation_data?.title || 'Unknown Title',
      description: item.occupation_data?.description || 'No description available',
      match_score: Math.round(Math.min(item.match_score, 100)) // Cap at 100%
    }));
    
  } catch (error) {
    console.error('Error in getJobsByMajorWithFilters:', error.message);
    return [];
  }
}

export default {
  getJobsByMajor,
  getDetailedJobInfo,
  getAllMajors,
  checkMajorMappingsExist,
  getMajorMappingStats,
  getJobsByMajorWithFilters
};
