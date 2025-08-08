# 🚀 WorkflowHub Setup Guide

This guide will walk you through setting up and running the WorkflowHub project locally.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **PostgreSQL** database (local or cloud)

## 🛠️ Step-by-Step Installation

### 1. Clone and Navigate to Project

```bash
# Clone the repository (replace with your actual repo URL)
git clone <your-repository-url>
cd workflowhub

# Or if you're starting fresh:
mkdir workflowhub
cd workflowhub
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Or if you prefer yarn:
yarn install
```

### 3. Set Up Environment Variables

```bash
# Copy the environment template
cp env.example .env.local
```

Now edit `.env.local` and fill in your configuration:

```env
# Database (Required)
DATABASE_URL="postgresql://username:password@localhost:5432/workflowhub"

# NextAuth (Required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Google OAuth (Required for authentication)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe (Optional - for payments)
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

# UploadThing (Optional - for file uploads)
UPLOADTHING_SECRET="sk_live_your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

### 4. Set Up Database

#### Option A: Local PostgreSQL

1. **Install PostgreSQL**:

   - **macOS**: `brew install postgresql`
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

2. **Create Database**:

   ```bash
   # Start PostgreSQL
   brew services start postgresql  # macOS
   # or
   sudo service postgresql start  # Linux

   # Create database
   createdb workflowhub
   ```

#### Option B: Cloud Database (Recommended)

Use a cloud PostgreSQL service like:

- **Vercel Postgres** (free tier available)
- **Supabase** (free tier available)
- **Railway** (free tier available)
- **Neon** (free tier available)

### 5. Generate Prisma Client

```bash
# Generate Prisma client
npm run db:generate
```

### 6. Set Up Database Schema

```bash
# Push the schema to your database
npm run db:push

# Or if you want to use migrations:
npm run db:migrate
```

### 7. Seed the Database

```bash
# Seed with sample data
npm run db:seed
```

This will create:

- Sample tags (Email, Marketing, Automation, etc.)
- Admin user (admin@workflowhub.com)
- Developer user (sarah@example.com)
- Sample workflows

### 8. Set Up Google OAuth (Required for Authentication)

1. **Go to Google Cloud Console**:

   - Visit [console.cloud.google.com](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**:

   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth Credentials**:

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3000/auth/callback/google`

4. **Copy Credentials**:
   - Copy the Client ID and Client Secret
   - Add them to your `.env.local` file

### 9. Run the Development Server

```bash
# Start the development server
npm run dev
```

### 10. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the WorkflowHub landing page!

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 🧪 Testing the Application

### 1. Test Authentication

- Click "Get Started" or "Sign In"
- You should be redirected to Google OAuth
- After signing in, you'll be redirected to the dashboard

### 2. Test Marketplace

- Navigate to `/marketplace`
- You should see sample workflows
- Test search and filtering functionality

### 3. Test Dashboard (Developer)

- Sign in with a Google account
- Navigate to `/dashboard`
- Try uploading a workflow (form validation will work)

### 4. Test Admin Panel

- Sign in with admin@workflowhub.com (if you have admin role)
- Navigate to `/admin`
- You should see pending workflows and user management

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Restart PostgreSQL
brew services restart postgresql
```

#### 2. Prisma Client Not Generated

```bash
# Regenerate Prisma client
npm run db:generate
```

#### 3. Environment Variables Not Loading

```bash
# Make sure you're using .env.local (not .env)
cp env.example .env.local
```

#### 4. Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

#### 5. Google OAuth Not Working

- Check that redirect URIs are correct
- Make sure Google+ API is enabled
- Verify Client ID and Secret are correct

### Getting Help

1. **Check the console** for error messages
2. **Check the browser console** for frontend errors
3. **Verify environment variables** are set correctly
4. **Check database connection** with `npm run db:studio`

## 🚀 Next Steps

Once the application is running locally:

1. **Add Real Payment Processing**:

   - Set up Stripe account
   - Configure webhooks
   - Test payment flow

2. **Add File Upload**:

   - Set up UploadThing account
   - Configure file upload settings
   - Test file upload functionality

3. **Deploy to Production**:
   - Push to GitHub
   - Connect to Vercel
   - Set up production environment variables

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the console logs for errors
3. Verify all environment variables are set
4. Make sure the database is properly configured

The application should now be fully functional with authentication, marketplace browsing, and basic workflow management!
