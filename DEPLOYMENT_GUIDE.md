# FDU Careers Exploration - Complete Deployment Guide

This guide will help you deploy your FDU Careers Exploration website on a free platform while maintaining all functionality and keeping your existing Supabase database connection.

## 🎯 Recommended Free Platforms

### **Option 1: Railway (Recommended)**
- **Free Tier**: $5 credit monthly (enough for small apps)
- **Pros**: Easy deployment, automatic HTTPS, environment variables support
- **Database**: Keep using your existing Supabase database
- **URL**: https://railway.app

### **Option 2: Render**
- **Free Tier**: 750 hours/month, sleeps after 15 minutes of inactivity
- **Pros**: Good for development/testing, easy setup
- **Database**: Keep using your existing Supabase database
- **URL**: https://render.com

### **Option 3: Vercel (Frontend) + Railway (Backend)**
- **Free Tier**: Both platforms have generous free tiers
- **Pros**: Best performance, separate frontend/backend deployment
- **Database**: Keep using your existing Supabase database

## 🚀 Deployment Steps (Railway - Recommended)

### Step 1: Prepare Your Project

1. **Create a `.env` file** in your project root:
```env
# Supabase Configuration
SUPABASE_URL=https://haqlioealqupvbnzbnqt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhcWxpb2VhbHF1cHZibnpibnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDMxODIsImV4cCI6MjA3MjkxOTE4Mn0.TzY9c1L5RFyB6HBaFmxjn7qlz_4PBpPZf9nUQmU8vHk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhcWxpb2VhbHF1cHZibnpibnF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzM0MzE4MiwiZXhwIjoyMDcyOTE5MTgyfQ.y3HreDT2p5WJleSuQCbQnkl38Klxx-a5GQBuip5Y-Iw

# Database Configuration
DATABASE_URL=postgresql://postgres:[iNDOJIN#130]@db.haqlioealqupvbnzbnqt.supabase.co:5432/postgres

# Application Configuration
NODE_ENV=production
PORT=3000

# Upload Configuration
BATCH_SIZE=1000
MAX_RETRIES=3
RETRY_DELAY=1000
```

2. **Update your `package.json`** to include a start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "web": "node server.js"
  }
}
```

3. **Create a `railway.json` file** in your project root:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Step 2: Deploy to Railway

1. **Sign up for Railway**:
   - Go to https://railway.app
   - Sign up with GitHub (recommended)

2. **Connect your repository**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure environment variables**:
   - Go to your project dashboard
   - Click on "Variables" tab
   - Add all the environment variables from your `.env` file

4. **Deploy**:
   - Railway will automatically detect it's a Node.js project
   - It will install dependencies and start your application
   - Your app will be available at a generated URL

### Step 3: Configure Custom Domain (Optional)

1. **In Railway dashboard**:
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Follow the DNS configuration instructions

## 🔧 Alternative: Render Deployment

### Step 1: Prepare for Render

1. **Create a `render.yaml` file** in your project root:
```yaml
services:
  - type: web
    name: fdu-careers-exploration
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SUPABASE_URL
        value: https://haqlioealqupvbnzbnqt.supabase.co
      - key: SUPABASE_ANON_KEY
        value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhcWxpb2VhbHF1cHZibnpibnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDMxODIsImV4cCI6MjA3MjkxOTE4Mn0.TzY9c1L5RFyB6HBaFmxjn7qlz_4PBpPZf9nUQmU8vHk
      - key: SUPABASE_SERVICE_ROLE_KEY
        value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhcWxpb2VhbHF1cHZibnpibnF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzM0MzE4MiwiZXhwIjoyMDcyOTE5MTgyfQ.y3HreDT2p5WJleSuQCbQnkl38Klxx-a5GQBuip5Y-Iw
      - key: DATABASE_URL
        value: postgresql://postgres:[iNDOJIN#130]@db.haqlioealqupvbnzbnqt.supabase.co:5432/postgres
```

### Step 2: Deploy to Render

1. **Sign up for Render**:
   - Go to https://render.com
   - Sign up with GitHub

2. **Create new Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure the service**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
   - **Plan**: `Free`

4. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy your application

## 🔒 Security Considerations

### Environment Variables Security

1. **Never commit sensitive data**:
   - Add `.env` to your `.gitignore`
   - Use platform-specific environment variable settings

2. **Supabase Security**:
   - Your Supabase keys are already configured
   - The service role key has full database access
   - Consider using Row Level Security (RLS) for production

3. **CORS Configuration**:
   - Update your Supabase project settings to allow your deployment domain
   - Go to Supabase Dashboard → Settings → API → CORS

## 📊 Monitoring and Maintenance

### Health Checks

Your application includes a health check endpoint at `/api/health` that returns:
```json
{
  "status": "ok",
  "database": "connected",
  "competencyMappings": true,
  "majorMappings": true,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Logs and Debugging

1. **Railway**:
   - View logs in the Railway dashboard
   - Real-time log streaming available

2. **Render**:
   - View logs in the Render dashboard
   - Logs are available for 7 days on free tier

### Database Monitoring

1. **Supabase Dashboard**:
   - Monitor database usage
   - View query performance
   - Check connection limits

2. **Application Monitoring**:
   - Set up alerts for database connection failures
   - Monitor response times

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check environment variables are set correctly
   - Verify Supabase project is active
   - Check network connectivity

2. **Build Failures**:
   - Ensure all dependencies are in `package.json`
   - Check Node.js version compatibility
   - Verify file paths are correct

3. **Environment Variables Not Loading**:
   - Double-check variable names and values
   - Ensure no extra spaces or quotes
   - Restart the application after changes

### Debug Steps

1. **Check application logs**:
   ```bash
   # In Railway dashboard or Render logs
   # Look for error messages and stack traces
   ```

2. **Test database connection**:
   - Visit `/api/health` endpoint
   - Check if database status is "connected"

3. **Verify environment variables**:
   - Check that all required variables are set
   - Ensure Supabase URL and keys are correct

## 🔄 Updates and Maintenance

### Deploying Updates

1. **Push to GitHub**:
   - Make your changes
   - Commit and push to your main branch
   - Platform will automatically redeploy

2. **Manual Deploy**:
   - Trigger manual deployment from platform dashboard
   - Useful for testing before pushing to main

### Database Updates

1. **Supabase Migrations**:
   - Use Supabase dashboard for schema changes
   - Your application will automatically use updated schema

2. **Data Updates**:
   - Use your existing upload scripts
   - Run locally and data will be available to deployed app

## 📈 Scaling Considerations

### Free Tier Limits

1. **Railway**:
   - $5 credit monthly
   - Automatic scaling
   - Sleep after 5 minutes of inactivity

2. **Render**:
   - 750 hours/month
   - Sleeps after 15 minutes of inactivity
   - Cold start takes ~30 seconds

### Upgrading (When Needed)

1. **Railway Pro** ($5/month):
   - Always-on deployment
   - Better performance
   - More resources

2. **Render Starter** ($7/month):
   - Always-on deployment
   - Better performance
   - Custom domains

## 🎯 Final Checklist

Before going live:

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Health check endpoint working
- [ ] All features tested on deployed version
- [ ] Custom domain configured (if desired)
- [ ] Supabase CORS settings updated
- [ ] Monitoring and alerts set up

## 📞 Support

If you encounter issues:

1. **Check the logs** in your deployment platform
2. **Test locally** to ensure code works
3. **Verify environment variables** are set correctly
4. **Check Supabase dashboard** for database issues

## 🎉 Success!

Once deployed, your FDU Careers Exploration website will be:
- ✅ Accessible worldwide
- ✅ Connected to your existing Supabase database
- ✅ Fully functional with all features
- ✅ Automatically updated when you push changes
- ✅ Monitored and maintained

Your application will be available at your platform's generated URL (e.g., `https://your-app-name.railway.app` or `https://your-app-name.onrender.com`).
