# WorkflowHub Deployment Guide

This guide covers all deployment options for WorkflowHub, from local development to production environments.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis (for rate limiting)
- Docker (optional)

### Environment Setup

1. **Copy environment template**

   ```bash
   cp env.example .env.local
   ```

2. **Configure required services**
   - Database (PostgreSQL)
   - OAuth providers (Google, Notion, Slack)
   - Payment processor (Stripe)
   - File storage (UploadThing)
   - AI services (OpenAI, Anthropic)
   - Rate limiting (Upstash Redis)
   - Email service (Resend)

## 🐳 Docker Deployment

### Local Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Build

```bash
# Build image
docker build -t workflowhub .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  workflowhub
```

### Docker Compose for Production

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      # Add other environment variables
    depends_on:
      - db
      - redis
    restart: unless-stopped
```

## ☁️ Cloud Deployment

### Vercel Deployment

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Add all required environment variables
   - Redeploy

### Fly.io Deployment

1. **Install Fly CLI**

   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Launch app**

   ```bash
   flyctl launch
   ```

3. **Deploy**

   ```bash
   flyctl deploy
   ```

4. **Set secrets**
   ```bash
   flyctl secrets set DATABASE_URL="your-database-url"
   flyctl secrets set NEXTAUTH_SECRET="your-secret"
   # Add other secrets
   ```

### Railway Deployment

1. **Connect repository**
   - Go to Railway dashboard
   - Connect your GitHub repository

2. **Configure environment**
   - Add all required environment variables
   - Railway will auto-deploy

### Render Deployment

1. **Create new Web Service**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set start command: `npm start`

2. **Configure environment**
   - Add all required environment variables
   - Deploy

## 🗄️ Database Setup

### PostgreSQL Options

#### Vercel Postgres

```bash
# Create database
npx vercel postgres create

# Connect to database
npx vercel postgres connect
```

#### Supabase

1. Create project at supabase.com
2. Get connection string
3. Update `DATABASE_URL`

#### Railway Postgres

1. Create PostgreSQL service in Railway
2. Get connection string
3. Update `DATABASE_URL`

#### External PostgreSQL

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb workflowhub

# Create user
sudo -u postgres createuser workflowhub_user

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE workflowhub TO workflowhub_user;"
```

### Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database
npm run db:seed
```

## 🔐 Authentication Setup

### Google OAuth

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project

2. **Enable OAuth API**
   - Go to APIs & Services > Library
   - Enable Google+ API

3. **Create OAuth Credentials**
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)

4. **Get credentials**
   - Copy Client ID and Client Secret
   - Add to environment variables

### Notion OAuth

1. **Create Notion Integration**
   - Go to [Notion Developers](https://developers.notion.com/)
   - Create new integration

2. **Configure OAuth**
   - Add redirect URI: `https://yourdomain.com/api/auth/callback/notion`
   - Get Client ID and Client Secret

### Slack OAuth

1. **Create Slack App**
   - Go to [Slack API](https://api.slack.com/apps)
   - Create new app

2. **Configure OAuth**
   - Add redirect URI: `https://yourdomain.com/api/auth/callback/slack`
   - Get Client ID and Client Secret

## 💳 Payment Setup

### Stripe Configuration

1. **Create Stripe Account**
   - Sign up at [stripe.com](https://stripe.com)
   - Get API keys from dashboard

2. **Configure Webhooks**
   - Go to Webhooks in Stripe dashboard
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`

3. **Environment Variables**
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

## 📁 File Storage Setup

### UploadThing Configuration

1. **Create Account**
   - Sign up at [uploadthing.com](https://uploadthing.com)
   - Create new app

2. **Get Credentials**
   - Copy API keys
   - Add to environment variables

3. **Configure File Types**
   - Allow JSON, YAML, ZIP files
   - Set size limits

## 🤖 AI Services Setup

### OpenAI Configuration

1. **Create Account**
   - Sign up at [openai.com](https://openai.com)
   - Get API key

2. **Environment Variable**
   ```env
   OPENAI_API_KEY=sk-...
   ```

### Anthropic Configuration

1. **Create Account**
   - Sign up at [anthropic.com](https://anthropic.com)
   - Get API key

2. **Environment Variable**
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   ```

## ⚡ Rate Limiting Setup

### Upstash Redis

1. **Create Database**
   - Go to [upstash.com](https://upstash.com)
   - Create Redis database

2. **Get Credentials**
   - Copy REST URL and token
   - Add to environment variables

## 📧 Email Setup

### Resend Configuration

1. **Create Account**
   - Sign up at [resend.com](https://resend.com)
   - Verify domain

2. **Get API Key**
   - Copy API key
   - Add to environment variables

## 🔍 Monitoring Setup

### Sentry (Error Tracking)

1. **Create Project**
   - Go to [sentry.io](https://sentry.io)
   - Create new project

2. **Get DSN**
   - Copy DSN
   - Add to environment variables

### Logtail (Logging)

1. **Create Account**
   - Sign up at [logtail.com](https://logtail.com)
   - Create new source

2. **Get Token**
   - Copy token
   - Add to environment variables

## 🧪 Testing Setup

### Local Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### CI/CD Testing

The GitHub Actions workflow automatically runs tests on:

- Pull requests
- Pushes to main/develop branches

## 🛠️ CLI Tools

### Health Check

```bash
# Check system health
npm run health
```

### Database Management

```bash
# Seed database
npm run cli db:seed

# Reset database (WARNING: deletes all data)
npm run cli db:reset --force
```

### Workflow Management

```bash
# List workflows
npm run cli workflow:list

# Execute workflow
npm run cli workflow:execute <workflowId> --input '{"key":"value"}'

# Get logs
npm run cli workflow:logs <workflowId>
```

### AI Features

```bash
# Generate workflow
npm run cli ai:generate --description "Email marketing automation" --tags "Email,Marketing"

# Get suggestions
npm run cli ai:suggestions
```

### Deployment

```bash
# Deploy to Vercel
npm run cli deploy:vercel

# Deploy to Fly.io
npm run cli deploy:fly
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**

   ```bash
   # Check database connection
   npm run cli health
   ```

2. **Environment Variables**

   ```bash
   # Verify all required variables are set
   node -e "console.log(process.env.DATABASE_URL)"
   ```

3. **Build Issues**

   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

4. **Docker Issues**
   ```bash
   # Rebuild Docker image
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Performance Optimization

1. **Database Indexes**

   ```sql
   -- Add indexes for better performance
   CREATE INDEX idx_workflows_status ON workflows(status);
   CREATE INDEX idx_workflows_user_id ON workflows(user_id);
   ```

2. **Caching**
   - Enable Redis caching
   - Use CDN for static assets

3. **Monitoring**
   - Set up alerts for errors
   - Monitor response times
   - Track user engagement

## 📊 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrated and seeded
- [ ] OAuth providers configured
- [ ] Stripe webhooks set up
- [ ] File storage configured
- [ ] AI services configured
- [ ] Rate limiting enabled
- [ ] Email service configured
- [ ] Monitoring set up
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Health checks passing
- [ ] Tests passing
- [ ] Security audit completed
- [ ] Backup strategy implemented
- [ ] Documentation updated

## 🚨 Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use different secrets for each environment
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict access by IP

3. **API Security**
   - Rate limit all endpoints
   - Validate all inputs
   - Sanitize outputs

4. **Runtime Security**
   - Sandbox workflow execution
   - Limit resource usage
   - Monitor for suspicious activity

## 📈 Scaling Considerations

1. **Database Scaling**
   - Use read replicas
   - Implement connection pooling
   - Consider sharding for large datasets

2. **Application Scaling**
   - Use load balancers
   - Implement horizontal scaling
   - Cache frequently accessed data

3. **File Storage Scaling**
   - Use CDN for static assets
   - Implement file compression
   - Consider object storage for large files

4. **Monitoring Scaling**
   - Set up distributed tracing
   - Implement log aggregation
   - Use APM tools for performance monitoring
