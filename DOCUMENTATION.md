# FDU Careers Exploration - Complete Documentation

A production-ready CLI-based career guidance application that helps students discover career paths based on their NACE competencies and course majors using a pre-populated O*NET occupational database.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Database Structure](#database-structure)
6. [Usage](#usage)
7. [Available Scripts](#available-scripts)
8. [Troubleshooting](#troubleshooting)
9. [Technical Details](#technical-details)
10. [Contributing](#contributing)

## Overview

FDU Careers Exploration is a production-ready command-line application that provides personalized career guidance by matching user competencies and academic majors with relevant occupations from a pre-populated O*NET database. The application uses a simplified 3-table database structure for optimal performance and reliability.

## Features

### 🎯 Competency-Based Career Matching
- Select your top 3 NACE competencies from 8 available options
- Get personalized career recommendations based on your strengths
- View detailed job information including required skills and knowledge
- Guaranteed 3 NACE competencies for every job role

### 🎓 Major-Based Career Exploration
- Choose from 15 different course majors
- Discover career opportunities related to your field of study
- Access detailed job descriptions and requirements
- Comprehensive major-to-career mappings

### 📊 Comprehensive Job Information
- Detailed job descriptions and requirements
- Required skills, knowledge, and abilities
- Education and training requirements
- Job zone information (experience level, education needed)
- Top matching NACE competencies for each position
- 100% job coverage - every job role is analyzed

## Prerequisites

- **Node.js** (v16 or higher)
- **Supabase account** with pre-populated O*NET database
- **Pre-configured database** with all mappings already generated

## Installation

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=your_database_url
   ```

3. **Start the application**
   ```bash
   npm start
   ```

### Environment Configuration

The application requires a `.env` file with your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

**Note:** This application is designed to work with a pre-populated database that already contains:
- All O*NET occupational data
- Pre-computed job-to-competency mappings
- Pre-computed job-to-major mappings
- Optimized database structure for fast queries

## Database Structure

### Simplified 3-Table Structure

The new system uses only 3 core tables instead of the previous 8+ table structure:

#### 1. `job_nace_mappings`
Stores the top 3 NACE competencies for each job:
- `job_code` - O*NET job code
- `competency_1`, `competency_2`, `competency_3` - Top 3 competencies
- `score_1`, `score_2`, `score_3` - Relevance scores

#### 2. `job_major_mappings`
Maps jobs to relevant course majors:
- `job_code` - O*NET job code
- `major_name` - Course major name
- `relevance_score` - Match percentage

#### 3. `job_competency_scores`
Detailed competency scores for analysis:
- `job_code` - O*NET job code
- `competency_name` - NACE competency name
- `score` - Detailed score

### Core O*NET Tables (Required)
- `occupation_data` - Basic job information
- `skills` - Required skills for each occupation
- `abilities` - Required abilities for each occupation
- `work_activities` - Work activities for each occupation
- `knowledge` - Required knowledge areas
- `education_training_experience` - Education requirements
- `job_zones` - Job zone information

## Usage

### Start the Application

```bash
npm start
```

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Application Features

The application provides two main functionalities:

#### Functionality A: Competency-Based Career Search
1. Select 3 of your strongest NACE competencies
2. Get personalized career recommendations
3. View detailed job information including top 3 matching competencies

#### Functionality B: Major-Based Career Exploration
1. Choose from 15 different course majors
2. Discover career opportunities related to your field of study
3. Access detailed job descriptions and requirements

## Available Scripts

- `npm start` - Start the application
- `npm run dev` - Start in development mode with auto-restart

## NACE Competencies

The application uses 8 NACE (National Association of Colleges and Employers) competencies:

1. **Communication** - Effectively exchange information, ideas, and thoughts
2. **Critical Thinking** - Analyze, evaluate, and synthesize information
3. **Leadership** - Guide, motivate, and influence others
4. **Teamwork** - Work collaboratively with others
5. **Technology** - Use, understand, and adapt to technological tools
6. **Professionalism** - Demonstrate appropriate workplace behavior
7. **Career & Self-Development** - Manage personal career growth
8. **Equity & Inclusion** - Work effectively with diverse groups

## Course Majors

15 different course majors are supported:

- Arts
- Social Sciences
- Environmental Studies
- Hospitality & Tourism Management
- Applied Technology
- Business
- Communications
- Digital Media Arts
- Healthcare Administration
- Homeland Security
- Human Resource Management
- Liberal Studies
- Public Administration
- Technology
- Sustainability

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify Supabase credentials in `.env`
   - Check if O*NET data is properly imported
   - Ensure database is accessible

2. **No Mappings Found**
   - Run `npm run improved-mapping` to generate comprehensive mappings
   - Check if mapping tables exist in database
   - Verify O*NET data is complete

3. **No Matching Careers**
   - This should not happen with the improved algorithm (100% coverage)
   - Check if mappings were created successfully
   - Run `npm test` to verify system status

4. **Permission Denied**
   - Use service role key for setup
   - Check database permissions
   - Verify RLS policies

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=true
```

### Manual Database Setup

If automated setup fails, manually run these SQL commands in Supabase:

```sql
-- Create job_nace_mappings table
CREATE TABLE job_nace_mappings (
  job_code VARCHAR(20) PRIMARY KEY,
  competency_1 VARCHAR(100) NOT NULL,
  competency_2 VARCHAR(100) NOT NULL,
  competency_3 VARCHAR(100) NOT NULL,
  score_1 DECIMAL(5,2) NOT NULL,
  score_2 DECIMAL(5,2) NOT NULL,
  score_3 DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job_major_mappings table
CREATE TABLE job_major_mappings (
  id SERIAL PRIMARY KEY,
  job_code VARCHAR(20) NOT NULL,
  major_name VARCHAR(100) NOT NULL,
  relevance_score DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job_competency_scores table
CREATE TABLE job_competency_scores (
  id SERIAL PRIMARY KEY,
  job_code VARCHAR(20) NOT NULL,
  competency_name VARCHAR(100) NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Technical Details

### How It Works

1. **Data Analysis**: The application analyzes O*NET data to identify keywords and patterns related to each NACE competency and course major.

2. **Mapping Generation**: Precomputed mappings are created by matching O*NET elements (skills, abilities, work activities) with competency keywords.

3. **Career Matching**: When users select competencies or majors, the application queries the precomputed mappings to find relevant careers.

4. **Scoring Algorithm**: A scoring algorithm calculates match percentages based on keyword frequency and relevance.

### Key Improvements

- **Comprehensive Analysis** - Analyzes ALL job roles in O*NET database
- **Guaranteed 3 Competencies** - Every job has exactly 3 top NACE competencies
- **Simplified Queries** - Fast, single-table lookups
- **Better Scoring** - Enhanced keyword matching algorithm
- **Complete Coverage** - No job roles are missed

### Performance Benefits

- **Faster queries** - No complex joins required
- **Better caching** - Precomputed results
- **Scalable** - Handles large datasets efficiently
- **Reliable** - Guaranteed data consistency

### Expected Results

After running the comprehensive mapping:

- **100% job coverage** - Every job in O*NET database analyzed
- **3 competencies per job** - Guaranteed for every job role
- **Accurate major mappings** - Relevant majors for each job
- **Fast performance** - Sub-second query responses
- **Reliable data** - Consistent, high-quality mappings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the database setup
3. Verify O*NET data import
4. Check Supabase connection

## Acknowledgments

- O*NET database for comprehensive occupational data
- NACE for competency framework
- Supabase for database hosting
- Node.js community for excellent tools and libraries

