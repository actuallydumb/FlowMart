# WorkflowHub - AI-Powered Automation Workflow Marketplace

A production-ready full-stack SaaS application for uploading, selling, and sharing automation workflows. Built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## 🚀 Features

### Core Functionality

- **Landing Page**: Modern, responsive design with hero section, features, and testimonials
- **Multi-Provider Authentication**: Google, Notion, and Slack OAuth integration with NextAuth.js
- **Marketplace**: Browse, search, and filter workflows by tags and categories
- **Developer Dashboard**: Upload, manage, and track earnings from workflows
- **Admin Panel**: Approve/reject workflows and manage users
- **Workflow Details**: Detailed view with preview, reviews, and purchase functionality

### Advanced Features

- **AI Workflow Generator**: Generate workflows from natural language descriptions using OpenAI
- **Runtime Engine**: Secure workflow execution with vm2 sandboxing
- **Workflow Versioning**: Track and manage workflow versions with changelog
- **Execution Logs**: Comprehensive logging and monitoring of workflow executions
- **Rate Limiting**: Per-organization rate limiting with Redis
- **Public Sharing**: Share workflows publicly with customizable permissions
- **Plugin Marketplace**: Extend functionality with third-party plugins
- **CLI Tools**: Command-line interface for workflow and deployment management

### Technical Features

- **Database**: PostgreSQL with Prisma ORM
- **File Upload**: UploadThing integration for workflow files
- **Payments**: Stripe integration for purchases and payouts
- **Styling**: Tailwind CSS with shadcn/ui components
- **Validation**: Zod schemas for form validation
- **SEO**: Optimized meta tags and structured data
- **Testing**: Jest and React Testing Library for comprehensive testing
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Containerization**: Docker and Docker Compose for easy deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma
- **Authentication**: NextAuth.js + Google/Notion/Slack OAuth
- **File Storage**: UploadThing
- **Payments**: Stripe
- **AI Integration**: OpenAI + Anthropic
- **Runtime**: vm2 for secure workflow execution
- **Rate Limiting**: Upstash Redis
- **Email**: Resend
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel, Fly.io, Docker

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis (for rate limiting)
- Docker (optional)

### 1. Clone the repository

```bash
git clone <repository-url>
cd workflowhub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/workflowhub"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NOTION_CLIENT_ID="your-notion-client-id"
NOTION_CLIENT_SECRET="your-notion-client-secret"
SLACK_CLIENT_ID="your-slack-client-id"
SLACK_CLIENT_SECRET="your-slack-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"

# UploadThing
UPLOADTHING_SECRET="sk_live_your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Email (Resend)
RESEND_API_KEY="re_your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Rate Limiting
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"

# AI Integration
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
LOGTAIL_TOKEN="your-logtail-token"

# Feature Flags
ENABLE_AI_GENERATOR="true"
ENABLE_PLUGIN_MARKETPLACE="true"
ENABLE_PUBLIC_SHARING="true"
ENABLE_WORKFLOW_VERSIONING="true"
```

### 4. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

### 6. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses the following main models:

- **User**: Authentication and user roles (ADMIN, DEVELOPER, BUYER)
- **Organization**: Multi-tenant organization support
- **Workflow**: Workflow metadata, files, and status
- **WorkflowVersion**: Version control for workflows
- **WorkflowExecution**: Execution tracking and results
- **WorkflowLog**: Comprehensive logging system
- **Tag**: Categories for organizing workflows
- **Purchase**: Transaction records for workflow purchases
- **Earnings**: Developer payout tracking
- **AdminReview**: Workflow approval/rejection records
- **Plugin**: Third-party plugin marketplace
- **RateLimit**: Per-organization rate limiting

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run with Docker
npm run docker:build
npm run docker:run

# Or use Docker Compose
npm run docker:compose
```

### Vercel Deployment

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

### Fly.io Deployment

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
flyctl launch
flyctl deploy
```

### Environment Setup

Make sure to configure these services:

1. **PostgreSQL Database**
   - Use Vercel Postgres, Supabase, or external provider
   - Update `DATABASE_URL` in environment variables

2. **OAuth Providers**
   - Google Cloud Console for Google OAuth
   - Notion API for Notion OAuth
   - Slack API for Slack OAuth
   - Add authorized redirect URIs

3. **Stripe**
   - Create Stripe account
   - Get API keys
   - Configure webhook endpoints

4. **UploadThing**
   - Create account at uploadthing.com
   - Get API keys
   - Configure file upload settings

5. **AI Services**
   - OpenAI API for workflow generation
   - Anthropic API for enhanced AI features

6. **Redis**
   - Upstash Redis for rate limiting
   - Configure Redis URL and token

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: `__tests__/` directory
- **Integration Tests**: API route testing
- **E2E Tests**: Playwright (coming soon)

## 🛠️ CLI Tools

The application includes a comprehensive CLI for management:

```bash
# Install CLI dependencies
npm install

# List workflows
npm run cli workflow:list

# Execute workflow
npm run cli workflow:execute <workflowId> --input '{"key":"value"}'

# Get workflow logs
npm run cli workflow:logs <workflowId>

# Generate workflow with AI
npm run cli ai:generate --description "Email marketing automation" --tags "Email,Marketing"

# Get AI suggestions
npm run cli ai:suggestions

# Database management
npm run cli db:seed
npm run cli db:reset --force

# Deployment
npm run cli deploy:vercel
npm run cli deploy:fly

# Health check
npm run cli health
```

## 📊 Monitoring

### Health Checks

```bash
# Check system health
npm run health
```

### Metrics

- Database connection status
- Rate limiting functionality
- AI service availability
- Payment processor status

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run cli` - Run CLI commands
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run docker:compose` - Start with Docker Compose

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma`
2. **API Routes**: Add to `app/api/` directory
3. **Pages**: Add to `app/` directory
4. **Components**: Add to `components/` directory
5. **Types**: Update `types/index.ts`
6. **Tests**: Add tests to `__tests__/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@workflowhub.com or create an issue in the repository.

## 🔮 Roadmap

### Completed Features ✅

- [x] Multi-provider OAuth (Google, Notion, Slack)
- [x] AI workflow generation
- [x] Runtime engine with sandboxing
- [x] Workflow versioning
- [x] Execution logging
- [x] Rate limiting
- [x] CLI tools
- [x] Docker deployment
- [x] CI/CD pipeline
- [x] Comprehensive testing

### Upcoming Features 🚧

- [ ] Advanced search and filtering
- [ ] User reviews and ratings
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Workflow templates
- [ ] Community features (forums, discussions)
- [ ] Advanced payment options
- [ ] Multi-language support
- [ ] Real-time collaboration
- [ ] Workflow marketplace analytics
- [ ] Advanced AI features (workflow optimization, suggestions)
- [ ] Plugin system
- [ ] Public workflow sharing
- [ ] Advanced monitoring and alerting
