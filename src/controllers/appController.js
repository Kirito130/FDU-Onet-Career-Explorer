/**
 * Application Controller
 * Main controller that orchestrates the CLI application flow
 * Handles user interactions and coordinates between services
 */

import competencyService from '../services/newCompetencyService.js';
import majorService from '../services/newMajorService.js';
import { testConnection } from '../database/supabase.js';
import {
  displayWelcome,
  displayMainMenu,
  selectCompetencies,
  selectCourseMajor,
  displayJobRoles,
  selectJobForDetails,
  displayJobDetails,
  showLoading,
  displayError,
  displaySuccess,
  displayAbout,
  displayGoodbye
} from '../cli/interface.js';
import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * Initialize the application
 * Tests database connection and checks if mappings exist
 */
export async function initializeApp() {
  const spinner = showLoading('Initializing application...');
  
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      spinner.fail('Failed to connect to database');
      return false;
    }
    
    // Check if competency mappings exist
    const competencyMappingsExist = await competencyService.checkCompetencyMappingsExist();
    if (!competencyMappingsExist) {
      spinner.warn('Competency mappings not found. Please run improved mapping first.');
      console.log(chalk.yellow('Run: npm run improved-mapping'));
      return false;
    }
    
    // Check if major mappings exist
    const majorMappingsExist = await majorService.checkMajorMappingsExist();
    if (!majorMappingsExist) {
      spinner.warn('Major mappings not found. Please run improved mapping first.');
      console.log(chalk.yellow('Run: npm run improved-mapping'));
      return false;
    }
    
    // Get mapping statistics
    const competencyStats = await competencyService.getCompetencyMappingStats();
    const majorStats = await majorService.getMajorMappingStats();
    
    if (competencyStats && majorStats) {
      console.log(chalk.green(`✅ Found ${competencyStats.totalMappings} competency mappings`));
      console.log(chalk.green(`✅ Found ${majorStats.totalMappings} major mappings`));
      console.log(chalk.blue(`📊 Coverage: ${competencyStats.coveragePercentage}% of jobs have competency mappings`));
    }
    
    spinner.succeed('Application initialized successfully');
    return true;
    
  } catch (error) {
    spinner.fail('Initialization failed');
    displayError(error.message);
    return false;
  }
}

/**
 * Handle competency-based career search
 */
export async function handleCompetencySearch() {
  try {
    // Get user's top 3 competencies
    const selectedCompetencies = await selectCompetencies();
    
    if (selectedCompetencies.length !== 3) {
      displayError('Please select exactly 3 competencies');
      return;
    }
    
    const spinner = showLoading('Finding careers that match your competencies...');
    
    // Get matching job roles
    const jobRoles = await competencyService.getJobsByCompetencies(selectedCompetencies);
    
    spinner.succeed(`Found ${jobRoles.length} matching careers`);
    
    if (jobRoles.length === 0) {
      displayError('No matching careers found. This should not happen with the improved algorithm.');
      return;
    }
    
    // Display job roles
    displayJobRoles(jobRoles, `Careers matching: ${selectedCompetencies.join(', ')}`);
    
    // Ask if user wants to see details
    const selectedJob = await selectJobForDetails(jobRoles);
    
    if (selectedJob && selectedJob !== 'back') {
      await showJobDetails(selectedJob);
    }
    
  } catch (error) {
    displayError(`Error in competency search: ${error.message}`);
  }
}

/**
 * Handle major-based career search
 */
export async function handleMajorSearch() {
  try {
    // Get user's course major
    const selectedMajor = await selectCourseMajor();
    
    const spinner = showLoading(`Finding careers related to ${selectedMajor}...`);
    
    // Get matching job roles
    const jobRoles = await majorService.getJobsByMajor(selectedMajor);
    
    spinner.succeed(`Found ${jobRoles.length} careers related to ${selectedMajor}`);
    
    if (jobRoles.length === 0) {
      displayError('No matching careers found for this major. This should not happen with the improved algorithm.');
      return;
    }
    
    // Display job roles
    displayJobRoles(jobRoles, `Careers related to ${selectedMajor}`);
    
    // Ask if user wants to see details
    const selectedJob = await selectJobForDetails(jobRoles);
    
    if (selectedJob && selectedJob !== 'back') {
      await showJobDetails(selectedJob);
    }
    
  } catch (error) {
    displayError(`Error in major search: ${error.message}`);
  }
}

/**
 * Show detailed job information
 * @param {string} onetsocCode - ONET SOC code for the job
 */
export async function showJobDetails(onetsocCode) {
  const spinner = showLoading('Loading detailed job information...');
  
  try {
    // Get detailed job information
    const jobDetails = await competencyService.getDetailedJobInfo(onetsocCode);
    
    if (!jobDetails) {
      spinner.fail('Failed to load job details');
      displayError('Job details not found');
      return;
    }
    
    spinner.succeed('Job details loaded successfully');
    
    // Display detailed information
    displayJobDetails(jobDetails);
    
    // Ask if user wants to continue
    const { continueExploring } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueExploring',
        message: 'Would you like to explore more careers?',
        default: true
      }
    ]);
    
    if (continueExploring) {
      await runApp();
    }
    
  } catch (error) {
    spinner.fail('Failed to load job details');
    displayError(`Error loading job details: ${error.message}`);
  }
}

/**
 * Display application statistics
 */
export async function displayAppStats() {
  const spinner = showLoading('Loading application statistics...');
  
  try {
    const competencyStats = await competencyService.getCompetencyMappingStats();
    const majorStats = await majorService.getMajorMappingStats();
    
    spinner.succeed('Statistics loaded');
    
    console.log(chalk.cyan.bold('\n📊 Application Statistics\n'));
    
    if (competencyStats) {
      console.log(chalk.blue.bold('Competency Mappings:'));
      console.log(chalk.white(`• Total mappings: ${competencyStats.totalMappings}`));
      console.log(chalk.white(`• Total jobs: ${competencyStats.totalJobs}`));
      console.log(chalk.white(`• Coverage: ${competencyStats.coveragePercentage}%`));
      console.log();
    }
    
    if (majorStats) {
      console.log(chalk.blue.bold('Major Mappings:'));
      console.log(chalk.white(`• Total mappings: ${majorStats.totalMappings}`));
      console.log(chalk.white(`• Total jobs: ${majorStats.totalJobs}`));
      console.log(chalk.white(`• Coverage: ${majorStats.coveragePercentage}%`));
      console.log();
    }
    
  } catch (error) {
    spinner.fail('Failed to load statistics');
    displayError(`Error loading statistics: ${error.message}`);
  }
}

/**
 * Main application loop
 */
export async function runApp() {
  try {
    displayWelcome();
    
    while (true) {
      const choice = await displayMainMenu();
      
      switch (choice) {
        case 'competencies':
          await handleCompetencySearch();
          break;
          
        case 'major':
          await handleMajorSearch();
          break;
          
        case 'stats':
          await displayAppStats();
          break;
          
        case 'about':
          displayAbout();
          await new Promise(resolve => {
            process.stdin.once('data', () => {
              resolve();
            });
          });
          break;
          
        case 'exit':
          displayGoodbye();
          process.exit(0);
          break;
          
        default:
          displayError('Invalid choice. Please try again.');
      }
    }
    
  } catch (error) {
    displayError(`Application error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Start the application
 */
export async function startApp() {
  try {
    // Initialize the application
    const initialized = await initializeApp();
    
    if (!initialized) {
      console.log(chalk.red.bold('\n❌ Application initialization failed'));
      console.log(chalk.yellow('Please ensure:'));
      console.log(chalk.yellow('1. Database connection is working'));
      console.log(chalk.yellow('2. Mapping tables are populated'));
      console.log(chalk.yellow('3. Run: npm run populate-mappings'));
      process.exit(1);
    }
    
    // Start the main application loop
    await runApp();
    
  } catch (error) {
    displayError(`Failed to start application: ${error.message}`);
    process.exit(1);
  }
}

export default {
  initializeApp,
  handleCompetencySearch,
  handleMajorSearch,
  showJobDetails,
  displayAppStats,
  runApp,
  startApp
};
