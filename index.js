#!/usr/bin/env node

/**
 * FDU Careers Exploration - Main Entry Point
 * CLI application for career guidance based on NACE competencies and course majors
 * 
 * Usage: node index.js
 * Or: npm start
 */

import { startApp } from './src/controllers/appController.js';
import chalk from 'chalk';

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(chalk.red.bold('\n❌ Uncaught Exception:'), error.message);
  console.error(chalk.gray(error.stack));
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red.bold('\n❌ Unhandled Rejection at:'), promise);
  console.error(chalk.red('Reason:'), reason);
  process.exit(1);
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log(chalk.yellow.bold('\n\n👋 Application interrupted by user'));
  process.exit(0);
});

// Start the application
console.log(chalk.cyan.bold('🚀 Starting FDU Careers Exploration...\n'));

startApp().catch((error) => {
  console.error(chalk.red.bold('\n❌ Fatal Error:'), error.message);
  console.error(chalk.gray(error.stack));
  process.exit(1);
});
