/**
 * New Competency Service - Simplified Structure
 * Works with the new 3-table database design
 */

import { supabase } from '../database/supabase.js';

/**
 * Get job roles that match the selected competency combination
 * @param {Array<string>} competencies - Array of 3 selected competencies
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} Array of matching job roles with match scores
 */
export async function getJobsByCompetencies(competencies, limit = null) {
  try {
    // Sort competencies to ensure consistent combination key
    const sortedCompetencies = [...competencies].sort();
    
    // Query jobs that have these competencies in their top 3
    let query = supabase
      .from('job_nace_mappings')
      .select(`
        *,
        occupation_data(onetsoc_code, title, description)
      `)
      .or(`competency_1.in.(${sortedCompetencies.join(',')}),competency_2.in.(${sortedCompetencies.join(',')}),competency_3.in.(${sortedCompetencies.join(',')})`)
      .order('competency_1_score', { ascending: false });
    
    // Only apply limit if specified
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching jobs by competencies:', error.message);
      return [];
    }
    
    // Calculate match scores based on competency positions
    return data.map(item => {
      let matchScore = 0;
      const jobCompetencies = [item.competency_1, item.competency_2, item.competency_3];
      let totalWeight = 0;
      
      // Calculate weighted score based on competency positions
      sortedCompetencies.forEach(comp => {
        const index = jobCompetencies.indexOf(comp);
        if (index !== -1) {
          // Higher score for competencies in higher positions
          const weight = 3 - index; // 3 for first, 2 for second, 1 for third
          const score = index === 0 ? item.competency_1_score : 
                       index === 1 ? item.competency_2_score : 
                       item.competency_3_score;
          matchScore += score * weight;
          totalWeight += weight;
        }
      });
      
      // Calculate percentage (0-100)
      const percentage = totalWeight > 0 ? (matchScore / totalWeight) : 0;
      
      return {
        onetsoc_code: item.onetsoc_code,
        title: item.occupation_data?.title || 'Unknown Title',
        description: item.occupation_data?.description || 'No description available',
        match_score: Math.round(Math.min(percentage, 100)) // Cap at 100%
      };
    });
    
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
    
    // Get major mappings for this job
    const { data: majorMappings } = await supabase
      .from('job_major_mappings')
      .select('*')
      .eq('onetsoc_code', onetsocCode)
      .order('match_score', { ascending: false });
    
    // Get top skills
    const { data: skillsData } = await supabase
      .from('skills')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false })
      .limit(15);
    
    // Get top knowledge areas
    const { data: knowledgeData } = await supabase
      .from('knowledge')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false })
      .limit(15);
    
    // Get abilities
    const { data: abilitiesData } = await supabase
      .from('abilities')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false })
      .limit(15);
    
    // Get work activities
    const { data: workActivitiesData } = await supabase
      .from('work_activities')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false })
      .limit(15);
    
    // Get work context
    const { data: workContextData } = await supabase
      .from('work_context')
      .select(`
        *,
        content_model_reference(element_name, description),
        work_context_categories(category_description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false })
      .limit(10);
    
    // Get work styles
    const { data: workStylesData } = await supabase
      .from('work_styles')
      .select(`
        *,
        content_model_reference(element_name, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('data_value', { ascending: false })
      .limit(10);
    
    // Get work values
    const { data: workValuesData } = await supabase
      .from('work_values')
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
      .limit(15);
    
    // Get technology skills
    const { data: technologySkillsData } = await supabase
      .from('technology_skills')
      .select(`
        *,
        unspsc_reference(commodity_title, class_title, family_title, segment_title)
      `)
      .eq('onetsoc_code', onetsocCode)
      .limit(20);
    
    // Get tools used
    const { data: toolsUsedData } = await supabase
      .from('tools_used')
      .select(`
        *,
        unspsc_reference(commodity_title, class_title, family_title, segment_title)
      `)
      .eq('onetsoc_code', onetsocCode)
      .limit(20);
    
    // Get task statements
    const { data: taskStatementsData } = await supabase
      .from('task_statements')
      .select('*')
      .eq('onetsoc_code', onetsocCode)
      .order('incumbents_responding', { ascending: false })
      .limit(20);
    
    // Get related occupations
    const { data: relatedOccupationsData } = await supabase
      .from('related_occupations')
      .select(`
        *,
        occupation_data!related_occupations_related_onetsoc_code_fkey(title, description)
      `)
      .eq('onetsoc_code', onetsocCode)
      .order('related_index', { ascending: true })
      .limit(10);
    
    // Get alternate titles
    const { data: alternateTitlesData } = await supabase
      .from('alternate_titles')
      .select('*')
      .eq('onetsoc_code', onetsocCode)
      .limit(10);
    
    // Get sample reported titles
    const { data: sampleTitlesData } = await supabase
      .from('sample_of_reported_titles')
      .select('*')
      .eq('onetsoc_code', onetsocCode)
      .limit(10);
    
    // Top competencies: use job_competency_scores when available (full importance data), else nace scores.
    // Min-max normalize to 10–100% so the lowest of the top 3 never shows 0% (per O*NET-style importance scaling).
    const topCompetencies = [];
    if (naceMapping) {
      const scoreByCompetency = (competencyScores || []).reduce((acc, row) => {
        acc[row.competency_name] = Number(row.score) || 0;
        return acc;
      }, {});
      const s1 = scoreByCompetency[naceMapping.competency_1] ?? Number(naceMapping.competency_1_score) ?? 0;
      const s2 = scoreByCompetency[naceMapping.competency_2] ?? Number(naceMapping.competency_2_score) ?? 0;
      const s3 = scoreByCompetency[naceMapping.competency_3] ?? Number(naceMapping.competency_3_score) ?? 0;
      const rawScores = [s1, s2, s3];
      const minS = Math.min(...rawScores);
      const maxS = Math.max(...rawScores);
      const floorPct = 10;
      const rangePct = 100 - floorPct;
      const toDisplay = (score) => {
        if (maxS <= minS) return 100;
        return Math.round(((score - minS) / (maxS - minS)) * rangePct + floorPct);
      };
      topCompetencies.push(
        { competency_name: naceMapping.competency_1, match_strength: Math.min(100, toDisplay(s1)) },
        { competency_name: naceMapping.competency_2, match_strength: Math.min(100, toDisplay(s2)) },
        { competency_name: naceMapping.competency_3, match_strength: Math.min(100, toDisplay(s3)) }
      );
    }

    // Major mappings: min-max normalize to 5–100% so the lowest related major never shows 0%.
    const majorList = majorMappings || [];
    const majorScores = majorList.map((m) => Number(m.match_score) || 0);
    const minMajor = majorScores.length ? Math.min(...majorScores) : 0;
    const maxMajor = majorScores.length ? Math.max(...majorScores, 1) : 1;
    const majorFloorPct = 5;
    const majorRangePct = 100 - majorFloorPct;
    const cappedMajorMappings = majorList.map((m) => {
      const raw = Number(m.match_score) || 0;
      const display = maxMajor <= minMajor ? 100 : Math.round(((raw - minMajor) / (maxMajor - minMajor)) * majorRangePct + majorFloorPct);
      return { ...m, match_score: Math.min(100, display) };
    });
    
    return {
      onetsoc_code: occupationData.onetsoc_code,
      title: occupationData.title,
      description: occupationData.description,
      job_zone: jobZoneData?.job_zone_reference || null,
      top_competencies: topCompetencies,
      major_mappings: cappedMajorMappings,
      skills: skillsData || [],
      knowledge: knowledgeData || [],
      abilities: abilitiesData || [],
      work_activities: workActivitiesData || [],
      work_context: workContextData || [],
      work_styles: workStylesData || [],
      work_values: workValuesData || [],
      education_training: educationData || [],
      technology_skills: technologySkillsData || [],
      tools_used: toolsUsedData || [],
      task_statements: taskStatementsData || [],
      related_occupations: relatedOccupationsData || [],
      alternate_titles: alternateTitlesData || [],
      sample_titles: sampleTitlesData || [],
      all_competency_scores: competencyScores || []
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
  return [
    'Communication',
    'Critical Thinking', 
    'Leadership',
    'Teamwork',
    'Technology',
    'Professionalism',
    'Career & Self-Development',
    'Equity & Inclusion'
  ];
}

/**
 * Check if competency mappings exist in the database
 * @returns {Promise<boolean>} True if mappings exist, false otherwise
 */
export async function checkCompetencyMappingsExist() {
  try {
    const { count, error } = await supabase
      .from('job_nace_mappings')
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
      .from('job_nace_mappings')
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
