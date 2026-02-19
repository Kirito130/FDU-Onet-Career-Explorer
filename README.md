# FDU Careers Exploration

A CLI-based career guidance application that helps students discover career paths based on their NACE competencies and course majors using the comprehensive O*NET occupational database.

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials (SUPABASE_URL, SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY)
   ```

3. **Start the application**
   ```bash
   npm start
   ```

## Features

- 🎯 **Competency-Based Career Matching** - Select your top 3 NACE competencies
- 🎓 **Major-Based Career Exploration** - Choose from 15 course majors
- 📊 **Comprehensive Job Information** - Detailed job descriptions and requirements
- 🚀 **100% Job Coverage** - Every job role is analyzed and mapped
- ⚡ **Fast Performance** - Optimized database structure for quick queries

## Documentation

For complete setup instructions, troubleshooting, and technical details, see **[DOCUMENTATION.md](./DOCUMENTATION.md)**.

## Available Scripts

- `npm start` - Start the web server (Express app)
- `npm run dev` - Start with file watching
- `npm run build` - Used by Netlify (no-op; build step required for deploy)

## Deploy on Netlify

1. Push the repo to GitHub/GitLab/Bitbucket and connect the site in [Netlify](https://app.netlify.com).
2. Build command: `npm run build` (or leave default; `netlify.toml` sets it).
3. Set **Environment variables** in Netlify: **Site settings → Environment variables**
   - `SUPABASE_URL` – your Supabase project URL
   - `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` – server key for database access
   - Optional: `SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL` if you use them.
4. Deploy. The whole app (front-end and back-end) runs as a single Netlify Function; all routes and static assets are served by the Express app.

## License

MIT License
