/**
 * CLI Interface for FDU Careers Exploration
 * Provides colorful, interactive command-line interface for user interactions
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { table } from 'table';

/**
 * Display welcome message with app branding
 */
export function displayWelcome() {
  console.clear();
  console.log(chalk.cyan.bold('\n╔══════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║                    O*NET CAREERS APP                        ║'));
  console.log(chalk.cyan.bold('║              Discover Your Perfect Career Path                ║'));
  console.log(chalk.cyan.bold('╚══════════════════════════════════════════════════════════════╝\n'));
  
  console.log(chalk.yellow('🎯 Find your ideal career based on your strengths and interests!'));
  console.log(chalk.gray('Powered by O*NET occupational data and NACE competencies\n'));
}

/**
 * Display main menu options
 */
export async function displayMainMenu() {
  const choices = [
    {
      name: '🎯 Find careers by my top 3 competencies',
      value: 'competencies',
      description: 'Select 3 of your strongest competencies to find matching careers'
    },
    {
      name: '🎓 Find careers by my course major',
      value: 'major',
      description: 'Select your course major to explore related career opportunities'
    },
    {
      name: '📊 View statistics',
      value: 'stats',
      description: 'View application statistics and mapping coverage'
    },
    {
      name: 'ℹ️  About this app',
      value: 'about',
      description: 'Learn more about how this app works'
    },
    {
      name: '❌ Exit',
      value: 'exit',
      description: 'Close the application'
    }
  ];

  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: chalk.blue.bold('What would you like to do?'),
      choices: choices,
      pageSize: 10
    }
  ]);

  return choice;
}

/**
 * Display competency selection interface
 */
export async function selectCompetencies() {
  console.log(chalk.blue.bold('\n📋 Select your top 3 strongest competencies:'));
  console.log(chalk.gray('Choose the areas where you excel and feel most confident\n'));

  const competencies = [
    {
      name: '💬 Communication',
      value: 'Communication',
      description: 'Effectively exchange information, ideas, and thoughts with others'
    },
    {
      name: '🧠 Critical Thinking',
      value: 'Critical Thinking',
      description: 'Analyze, evaluate, and synthesize information to make informed decisions'
    },
    {
      name: '👑 Leadership',
      value: 'Leadership',
      description: 'Guide, motivate, and influence others to achieve common goals'
    },
    {
      name: '🤝 Teamwork',
      value: 'Teamwork',
      description: 'Work collaboratively with others to achieve shared objectives'
    },
    {
      name: '💻 Technology',
      value: 'Technology',
      description: 'Use, understand, and adapt to technological tools and systems'
    },
    {
      name: '💼 Professionalism',
      value: 'Professionalism',
      description: 'Demonstrate appropriate workplace behavior, ethics, and work habits'
    },
    {
      name: '📈 Career & Self-Development',
      value: 'Career & Self-Development',
      description: 'Manage personal career growth and continuous learning'
    },
    {
      name: '🌍 Equity & Inclusion',
      value: 'Equity & Inclusion',
      description: 'Work effectively with diverse groups and promote inclusive environments'
    }
  ];

  const { selectedCompetencies } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedCompetencies',
      message: chalk.blue.bold('Select exactly 3 competencies (use spacebar to select):'),
      choices: competencies,
      validate: (input) => {
        if (input.length !== 3) {
          return 'Please select exactly 3 competencies';
        }
        return true;
      },
      pageSize: 10
    }
  ]);

  return selectedCompetencies;
}

/**
 * Display course major selection interface
 */
export async function selectCourseMajor() {
  console.log(chalk.blue.bold('\n🎓 Select your course major:'));
  console.log(chalk.gray('Choose the field of study that best matches your academic focus\n'));

  const majors = [
    {
      name: '🎨 Arts',
      value: 'Arts',
      description: 'Creative and visual arts including fine arts, performing arts, and design'
    },
    {
      name: '👥 Social Sciences',
      value: 'Social Sciences',
      description: 'Study of human society and social relationships'
    },
    {
      name: '🌱 Environmental Studies',
      value: 'Environmental Studies',
      description: 'Interdisciplinary study of environmental issues and sustainability'
    },
    {
      name: '🏨 Hospitality & Tourism Management',
      value: 'Hospitality & Tourism Management',
      description: 'Management and operations in hospitality and tourism industries'
    },
    {
      name: '⚙️ Applied Technology',
      value: 'Applied Technology',
      description: 'Practical application of technology in various industries'
    },
    {
      name: '💼 Business',
      value: 'Business',
      description: 'Study of business operations, management, and entrepreneurship'
    },
    {
      name: '📢 Communications',
      value: 'Communications',
      description: 'Study of communication theory and practice across various media'
    },
    {
      name: '🎬 Digital Media Arts',
      value: 'Digital Media Arts',
      description: 'Creative and technical skills in digital media production'
    },
    {
      name: '🏥 Healthcare Administration',
      value: 'Healthcare Administration',
      description: 'Management and administration in healthcare organizations'
    },
    {
      name: '🛡️ Homeland Security',
      value: 'Homeland Security',
      description: 'Study of security, emergency management, and public safety'
    },
    {
      name: '👥 Human Resource Management',
      value: 'Human Resource Management',
      description: 'Management of human resources and organizational behavior'
    },
    {
      name: '📚 Liberal Studies',
      value: 'Liberal Studies',
      description: 'Interdisciplinary study across multiple academic fields'
    },
    {
      name: '🏛️ Public Administration',
      value: 'Public Administration',
      description: 'Study of government operations and public policy'
    },
    {
      name: '💻 Technology',
      value: 'Technology',
      description: 'Study of computer science, information technology, and technical systems'
    },
    {
      name: '🌿 Sustainability',
      value: 'Sustainability',
      description: 'Study of environmental sustainability and sustainable practices'
    }
  ];

  const { selectedMajor } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedMajor',
      message: chalk.blue.bold('Choose your course major:'),
      choices: majors,
      pageSize: 10
    }
  ]);

  return selectedMajor;
}

/**
 * Display job roles in a formatted table
 * @param {Array} jobRoles - Array of job role objects
 * @param {string} title - Title for the display
 */
export function displayJobRoles(jobRoles, title = 'Matching Career Opportunities') {
  console.log(chalk.green.bold(`\n✨ ${title}\n`));
  
  if (jobRoles.length === 0) {
    console.log(chalk.yellow('No matching careers found. Try different selections.'));
    return;
  }

  const tableData = [
    [chalk.cyan.bold('Rank'), chalk.cyan.bold('Job Title'), chalk.cyan.bold('Match Score'), chalk.cyan.bold('Description')]
  ];

  jobRoles.forEach((job, index) => {
    const description = job.description ? 
      (job.description.length > 80 ? job.description.substring(0, 80) + '...' : job.description) :
      'No description available';
    
    tableData.push([
      chalk.white(`${index + 1}.`),
      chalk.yellow(job.title),
      chalk.green(`${job.match_score}%`),
      chalk.gray(description)
    ]);
  });

  const tableConfig = {
    border: {
      topBody: '─',
      topJoin: '┬',
      topLeft: '┌',
      topRight: '┐',
      bottomBody: '─',
      bottomJoin: '┴',
      bottomLeft: '└',
      bottomRight: '┘',
      bodyLeft: '│',
      bodyRight: '│',
      bodyJoin: '│',
      joinBody: '─',
      joinLeft: '├',
      joinRight: '┤',
      joinJoin: '┼'
    },
    columnDefault: {
      paddingLeft: 1,
      paddingRight: 1
    },
    header: {
      alignment: 'center',
      content: chalk.cyan.bold(title)
    }
  };

  console.log(table(tableData, tableConfig));
}

/**
 * Display job selection prompt
 * @param {Array} jobRoles - Array of job role objects
 */
export async function selectJobForDetails(jobRoles) {
  if (jobRoles.length === 0) {
    return null;
  }

  const choices = jobRoles.map((job, index) => ({
    name: `${index + 1}. ${job.title} (${job.match_score}% match)`,
    value: job.onetsoc_code,
    short: job.title
  }));

  choices.push({
    name: chalk.gray('← Back to main menu'),
    value: 'back',
    short: 'Back'
  });

  const { selectedJob } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedJob',
      message: chalk.blue.bold('Select a job to view detailed information:'),
      choices: choices,
      pageSize: 15
    }
  ]);

  return selectedJob;
}

/**
 * Display detailed job information
 * @param {Object} jobDetails - Detailed job information object
 */
export function displayJobDetails(jobDetails) {
  console.log(chalk.cyan.bold('\n📋 Detailed Job Information\n'));
  console.log(chalk.yellow.bold(`Job Title: ${jobDetails.title}`));
  console.log(chalk.gray(`ONET SOC Code: ${jobDetails.onetsoc_code}\n`));
  
  if (jobDetails.description) {
    console.log(chalk.blue.bold('📝 Job Description:'));
    console.log(chalk.white(jobDetails.description));
    console.log();
  }

  if (jobDetails.job_zone) {
    console.log(chalk.blue.bold('🎯 Job Zone Information:'));
    console.log(chalk.white(`Zone: ${jobDetails.job_zone.name}`));
    console.log(chalk.white(`Experience Required: ${jobDetails.job_zone.experience}`));
    console.log(chalk.white(`Education Required: ${jobDetails.job_zone.education}`));
    console.log(chalk.white(`Job Training: ${jobDetails.job_zone.job_training}`));
    console.log();
  }

  if (jobDetails.top_competencies && jobDetails.top_competencies.length > 0) {
    console.log(chalk.blue.bold('🏆 Top Matching NACE Competencies:'));
    jobDetails.top_competencies.forEach((comp, index) => {
      console.log(chalk.white(`${index + 1}. ${comp.competency_name} (${comp.match_strength}% match)`));
    });
    console.log();
  }

  if (jobDetails.skills && jobDetails.skills.length > 0) {
    console.log(chalk.blue.bold('🛠️ Key Skills Required:'));
    jobDetails.skills.slice(0, 10).forEach((skill, index) => {
      const skillName = skill.content_model_reference?.element_name || 'Unknown Skill';
      const level = skill.data_value ? Math.round(skill.data_value) : 'N/A';
      console.log(chalk.white(`${index + 1}. ${skillName} (Level: ${level})`));
    });
    console.log();
  }

  if (jobDetails.knowledge && jobDetails.knowledge.length > 0) {
    console.log(chalk.blue.bold('📚 Knowledge Areas:'));
    jobDetails.knowledge.slice(0, 10).forEach((knowledge, index) => {
      const knowledgeName = knowledge.content_model_reference?.element_name || 'Unknown Knowledge';
      const level = knowledge.data_value ? Math.round(knowledge.data_value) : 'N/A';
      console.log(chalk.white(`${index + 1}. ${knowledgeName} (Level: ${level})`));
    });
    console.log();
  }
}

/**
 * Display loading spinner with message
 * @param {string} message - Loading message
 * @returns {Object} Ora spinner instance
 */
export function showLoading(message) {
  return ora({
    text: message,
    spinner: 'dots',
    color: 'cyan'
  }).start();
}

/**
 * Display error message
 * @param {string} message - Error message
 */
export function displayError(message) {
  console.log(chalk.red.bold('\n❌ Error:'), chalk.red(message));
}

/**
 * Display success message
 * @param {string} message - Success message
 */
export function displaySuccess(message) {
  console.log(chalk.green.bold('\n✅ Success:'), chalk.green(message));
}

/**
 * Display about information
 */
export function displayAbout() {
  console.log(chalk.cyan.bold('\n📖 About FDU Careers Exploration\n'));
  console.log(chalk.white('This application helps you discover career paths based on:'));
  console.log(chalk.white('• Your top 3 NACE competencies (strengths)'));
  console.log(chalk.white('• Your course major or field of study'));
  console.log();
  console.log(chalk.white('The app uses the comprehensive O*NET occupational database'));
  console.log(chalk.white('to match your skills and interests with real career opportunities.'));
  console.log();
  console.log(chalk.white('NACE Competencies are industry-recognized skills that employers'));
  console.log(chalk.white('value across all career fields.'));
  console.log();
  console.log(chalk.gray('Press any key to continue...'));
}

/**
 * Display goodbye message
 */
export function displayGoodbye() {
  console.log(chalk.cyan.bold('\n👋 Thank you for using FDU Careers Exploration!'));
  console.log(chalk.yellow('Good luck with your career exploration! 🚀\n'));
}

export default {
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
};
