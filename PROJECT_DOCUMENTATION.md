# WorkflowKart - Project Documentation

## Project Overview

WorkflowHub is a full-stack SaaS platform for buying, selling, and automating workflows. It's a marketplace where developers can upload automation workflows and users can purchase them for their business needs. The platform features AI-powered workflow generation, secure execution environments, payment processing, and comprehensive user management.

### Architecture

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js with multiple OAuth providers (Google, Notion, Slack)
- **Payments**: Stripe integration with webhooks
- **File Storage**: UploadThing for secure file management
- **AI Integration**: OpenAI and Anthropic for workflow generation
- **Runtime Engine**: vm2 sandbox for secure workflow execution
- **Rate Limiting**: Upstash Redis for API protection
- **Testing**: Jest and React Testing Library
- **Deployment**: Docker, Vercel, Fly.io

### Key Features

- Multi-tenant marketplace for workflow trading
- AI-powered workflow generation from natural language
- Secure workflow execution with sandboxing
- Payment processing with automatic developer payouts
- Role-based access control (Admin, Developer, Buyer)
- Workflow versioning and execution tracking
- Comprehensive analytics and reporting
- Public workflow sharing with permissions

## Folder Structure

### Root Configuration Files

- **package.json** — Project dependencies and scripts configuration
  - Dependencies: Next.js 14, React 18, TypeScript, Prisma, Stripe, UploadThing, NextAuth.js
  - Scripts: Development, testing, database management, Docker deployment
  - Key exports: Project metadata and build configuration

- **tsconfig.json** — TypeScript configuration
  - Strict type checking enabled
  - Path mapping for clean imports (@/\*)
  - Next.js plugin integration
  - ES5 target with modern module resolution

- **next.config.js** — Next.js configuration
  - Image domain configuration for external sources
  - Security headers (X-Frame-Options, X-Content-Type-Options)
  - Docker standalone output optimization
  - Webpack optimizations for bundle size

- **tailwind.config.js** — Tailwind CSS configuration
  - Custom color scheme with CSS variables
  - shadcn/ui component styling
  - Animation configurations
  - Responsive breakpoint settings

- **jest.config.js** — Jest testing configuration
  - Test environment setup for React components
  - Coverage reporting configuration
  - Module path mapping for imports

- **jest.setup.js** — Jest test environment setup
  - DOM testing utilities configuration
  - Mock setup for external dependencies
  - Global test utilities

- **middleware.ts** — Next.js middleware
  - Authentication route protection
  - Role-based access control
  - API rate limiting
  - Request/response modification

- **Dockerfile** — Docker container configuration
  - Multi-stage build for optimization
  - Node.js runtime environment
  - Production-ready configuration

- **docker-compose.yml** — Docker Compose configuration
  - PostgreSQL database service
  - Redis cache service
  - Application service orchestration
  - Environment variable management

- **env.example** — Environment variables template
  - Database connection strings
  - OAuth provider credentials
  - API keys for external services
  - Security configuration

### /app — Next.js App Router

#### Core App Files

- **layout.tsx** — Root application layout
  - Providers setup (auth, theme, toast)
  - Global navigation and footer
  - Error boundary configuration

- **page.tsx** — Landing page component
  - Hero section with call-to-action
  - Feature showcase
  - Testimonials and social proof
  - SEO optimization

- **globals.css** — Global styles
  - CSS variables for theming
  - Tailwind CSS imports
  - Custom component styles

- **loading.tsx** — Loading state component
  - Skeleton loading UI
  - Progress indicators

- **error.tsx** — Error boundary component
  - Error handling and display
  - Recovery mechanisms

- **not-found.tsx** — 404 page component
  - Custom 404 error page
  - Navigation back to home

- **global-error.tsx** — Global error handler
  - Root-level error catching
  - Fallback error UI

#### /app/api — API Routes

##### /app/api/auth

- **[...nextauth]/route.ts** — NextAuth.js configuration
  - OAuth provider setup (Google, Notion, Slack)
  - Credentials authentication
  - Session management
  - JWT token handling

- **signup/route.ts** — User registration endpoint
  - Email/password registration
  - Password hashing with bcrypt
  - User role assignment
  - Email verification

- **link-account/route.ts** — Account linking endpoint
  - OAuth account association
  - Multiple provider support
  - Account merging logic

##### /app/api/workflows

- **route.ts** — Workflow CRUD operations
  - GET: List workflows with filtering
  - POST: Create new workflow
  - PUT: Update workflow
  - DELETE: Remove workflow

- **[id]/route.ts** — Individual workflow operations
  - GET: Fetch workflow details
  - PUT: Update specific workflow
  - DELETE: Remove specific workflow

- **[id]/download/route.ts** — Workflow download endpoint
  - Purchase verification
  - File access control
  - Download tracking

- **[id]/reviews/route.ts** — Workflow reviews
  - GET: Fetch workflow reviews
  - POST: Create new review
  - PUT: Update review
  - DELETE: Remove review

- **[id]/executions/route.ts** — Workflow execution tracking
  - GET: Fetch execution history
  - POST: Log new execution
  - PUT: Update execution status

- **execute/route.ts** — Workflow execution endpoint
  - Runtime engine integration
  - Input validation
  - Execution monitoring
  - Result handling

- **featured/route.ts** — Featured workflows
  - GET: Curated workflow list
  - Admin selection logic
  - Performance metrics

- **my-workflows/route.ts** — User's workflows
  - GET: Developer's workflow list
  - Role-based filtering
  - Earnings calculation

##### /app/api/admin

- **workflows/pending/route.ts** — Pending workflow approval
  - GET: List pending workflows
  - Admin review interface

- **workflows/[id]/approve/route.ts** — Workflow approval
  - POST: Approve workflow
  - Status update
  - Notification sending

- **workflows/[id]/reject/route.ts** — Workflow rejection
  - POST: Reject workflow
  - Feedback provision
  - Developer notification

- **users/route.ts** — User management
  - GET: List all users
  - PUT: Update user details
  - DELETE: Remove user

- **users/[userId]/roles/route.ts** — Role management
  - PUT: Update user roles
  - Role validation
  - Permission checking

- **sellers/route.ts** — Seller management
  - GET: List sellers
  - PUT: Update seller status
  - Verification handling

- **sellers/[id]/approve/route.ts** — Seller approval
  - POST: Approve seller
  - Verification completion
  - Email notification

- **sellers/[id]/reject/route.ts** — Seller rejection
  - POST: Reject seller
  - Feedback provision
  - Status update

##### /app/api/purchases

- **check/[workflowId]/route.ts** — Purchase verification
  - GET: Check if user purchased workflow
  - Access control validation
  - Download permission

- **my-purchases/route.ts** — User's purchases
  - GET: List user's purchases
  - Purchase history
  - Download links

##### /app/api/checkout

- **route.ts** — Stripe checkout integration
  - POST: Create checkout session
  - Payment processing
  - Success/failure handling

##### /app/api/webhooks

- **stripe/route.ts** — Stripe webhook handler
  - Payment confirmation
  - Purchase record creation
  - Developer earnings calculation
  - Email notifications

##### /app/api/ai

- **generate/route.ts** — AI workflow generation
  - OpenAI/Anthropic integration
  - Natural language processing
  - Workflow code generation
  - Validation and testing

- **suggestions/route.ts** — AI suggestions
  - Workflow improvement suggestions
  - Tag recommendations
  - Description optimization

##### /app/api/analytics

- **dashboard/route.ts** — Analytics data
  - GET: Dashboard metrics
  - Sales analytics
  - User engagement data
  - Performance metrics

##### /app/api/uploadthing

- **route.ts** — File upload configuration
  - UploadThing integration
  - File type validation
  - Size limits
  - Access control

##### /app/api/onboarding

- **save/route.ts** — Onboarding progress
  - POST: Save onboarding data
  - User preference storage
  - Progress tracking

- **status/route.ts** — Onboarding status
  - GET: Check onboarding completion
  - Step tracking
  - Completion validation

##### /app/api/user

- **profile/route.ts** — User profile management
  - GET: Fetch user profile
  - PUT: Update profile
  - Avatar handling

##### /app/api/tags

- **route.ts** — Tag management
  - GET: List available tags
  - POST: Create new tag
  - PUT: Update tag
  - DELETE: Remove tag

##### /app/api/testimonials

- **route.ts** — Testimonials management
  - GET: List testimonials
  - POST: Add testimonial
  - PUT: Update testimonial
  - DELETE: Remove testimonial

##### /app/api/blogs

- **route.ts** — Blog management
  - GET: List blog posts
  - POST: Create blog post
  - PUT: Update blog post
  - DELETE: Remove blog post

##### /app/api/contact

- **route.ts** — Contact form handling
  - POST: Process contact submissions
  - Email sending
  - Spam protection

##### /app/api/receipt

- **[purchaseId]/route.ts** — Purchase receipt
  - GET: Generate receipt PDF
  - Purchase details
  - Tax information

#### /app/auth — Authentication Pages

- **signin/page.tsx** — Sign in page
  - Login form
  - OAuth provider buttons
  - Password reset link

- **signup/page.tsx** — Registration page
  - Registration form
  - Terms acceptance
  - Email verification

- **error/page.tsx** — Authentication error page
  - Error display
  - Recovery options

#### /app/dashboard — User Dashboard

- **page.tsx** — Main dashboard
  - User overview
  - Quick actions
  - Recent activity
  - Analytics summary

#### /app/marketplace — Workflow Marketplace

- **page.tsx** — Marketplace page
  - Workflow grid display
  - Search and filtering
  - Category navigation
  - Featured workflows

#### /app/workflow — Workflow Details

- **[id]/page.tsx** — Individual workflow page
  - Workflow details
  - Preview and documentation
  - Purchase options
  - Reviews and ratings

#### /app/seller — Seller Tools

- **create-workflow/page.tsx** — Workflow creation
  - Upload form
  - Metadata input
  - Preview generation
  - Submission handling

#### /app/admin — Admin Panel

- **page.tsx** — Admin dashboard
  - Platform overview
  - User management
  - Workflow approval queue
  - Analytics dashboard

- **sellers/page.tsx** — Seller management
  - Seller list
  - Verification requests
  - Approval/rejection tools

#### /app/onboarding — User Onboarding

- **page.tsx** — Onboarding flow
  - Multi-step process
  - User preference collection
  - Role selection
  - Integration setup

#### /app/profile — User Profile

- **page.tsx** — Profile management
  - Personal information
  - Account settings
  - Security options
  - Integration management

#### /app/settings — Application Settings

- **page.tsx** — Settings page
  - Notification preferences
  - Privacy settings
  - Account management
  - Billing information

#### /app/blog — Blog System

- **page.tsx** — Blog listing
  - Article grid
  - Search functionality
  - Category filtering

- **[id]/page.tsx** — Individual blog post
  - Article content
  - Author information
  - Related posts
  - Social sharing

#### /app/about — Static Pages

- **page.tsx** — About page
  - Company information
  - Team details
  - Mission statement

#### /app/contact — Contact Information

- **page.tsx** — Contact page
  - Contact form
  - Location information
  - Support details

#### /app/careers — Career Information

- **page.tsx** — Careers page
  - Job listings
  - Company culture
  - Application process

#### /app/privacy — Legal Pages

- **page.tsx** — Privacy policy
  - Data handling information
  - User rights
  - Contact details

#### /app/terms — Terms of Service

- **page.tsx** — Terms of service
  - Usage terms
  - Liability information
  - Dispute resolution

#### /app/cookies — Cookie Policy

- **page.tsx** — Cookie policy
  - Cookie usage
  - Opt-out options
  - Data collection

#### /app/theme-test — Development Tools

- **page.tsx** — Theme testing
  - Component showcase
  - Design system testing
  - Development utilities

### /components — React Components

#### Core Components

- **navbar.tsx** — Main navigation component
  - User menu
  - Search functionality
  - Mobile responsiveness
  - Authentication state

- **footer.tsx** — Site footer
  - Links and navigation
  - Social media
  - Legal information
  - Newsletter signup

- **providers.tsx** — Context providers
  - Authentication provider
  - Theme provider
  - Toast notifications
  - Global state management

- **cookie-consent.tsx** — Cookie consent banner
  - GDPR compliance
  - Cookie preferences
  - Opt-in/opt-out functionality

#### Workflow Components

- **workflow-card.tsx** — Workflow display card
  - Workflow preview
  - Price and rating
  - Quick actions
  - Responsive design

- **upload-workflow-dialog.tsx** — Workflow upload modal
  - File upload interface
  - Metadata input forms
  - Preview generation
  - Validation handling

- **edit-workflow-dialog.tsx** — Workflow editing modal
  - Update workflow details
  - File replacement
  - Version management
  - Status updates

#### Review Components

- **review-form.tsx** — Review submission form
  - Rating input
  - Review text
  - Validation
  - Submission handling

- **reviews-list.tsx** — Reviews display
  - Review grid
  - Rating filters
  - Pagination
  - Sort options

#### Analytics Components

- **analytics-charts.tsx** — Data visualization
  - Sales charts
  - User engagement metrics
  - Performance graphs
  - Interactive dashboards

#### Media Components

- **media-gallery.tsx** — Media display
  - Image carousel
  - Video player
  - Thumbnail navigation
  - Full-screen view

#### /components/ui — UI Component Library

- **button.tsx** — Button component
  - Multiple variants (primary, secondary, destructive)
  - Size options (sm, md, lg)
  - Loading states
  - Icon support

- **input.tsx** — Input field component
  - Text input
  - Validation states
  - Error messages
  - Accessibility features

- **textarea.tsx** — Textarea component
  - Multi-line input
  - Character counting
  - Auto-resize
  - Validation support

- **select.tsx** — Select dropdown component
  - Single/multi selection
  - Search functionality
  - Custom options
  - Keyboard navigation

- **checkbox.tsx** — Checkbox component
  - Custom styling
  - Indeterminate state
  - Accessibility
  - Form integration

- **switch.tsx** — Toggle switch component
  - On/off states
  - Smooth animations
  - Accessibility
  - Form integration

- **dialog.tsx** — Modal dialog component
  - Overlay backdrop
  - Focus management
  - Keyboard navigation
  - Responsive design

- **card.tsx** — Card container component
  - Header, content, footer sections
  - Shadow and border options
  - Hover effects
  - Responsive layout

- **badge.tsx** — Badge component
  - Status indicators
  - Color variants
  - Size options
  - Icon support

- **avatar.tsx** — Avatar component
  - Image display
  - Fallback initials
  - Size variants
  - Group display

- **dropdown-menu.tsx** — Dropdown menu component
  - Nested menus
  - Keyboard navigation
  - Custom triggers
  - Positioning options

- **tabs.tsx** — Tab component
  - Horizontal/vertical tabs
  - Content switching
  - Keyboard navigation
  - Responsive design

- **progress.tsx** — Progress indicator component
  - Linear progress bars
  - Circular progress
  - Animated states
  - Value display

- **skeleton.tsx** — Loading skeleton component
  - Placeholder content
  - Animated loading
  - Customizable shapes
  - Responsive design

- **separator.tsx** — Separator component
  - Horizontal/vertical lines
  - Customizable styling
  - Accessibility
  - Layout spacing

- **label.tsx** — Label component
  - Form labels
  - Accessibility features
  - Required indicators
  - Custom styling

- **form.tsx** — Form component
  - React Hook Form integration
  - Zod validation
  - Error handling
  - Field management

#### /components/onboarding — Onboarding Components

- **buyer-step-1.tsx** — Buyer onboarding step 1
  - Interest selection
  - Category preferences
  - Goal setting

- **buyer-step-2.tsx** — Buyer onboarding step 2
  - Integration preferences
  - Tool selection
  - Workflow needs

- **buyer-step-3.tsx** — Buyer onboarding step 3
  - Final preferences
  - Account setup
  - Welcome message

- **seller-step-1.tsx** — Seller onboarding step 1
  - Professional information
  - Experience details
  - Portfolio setup

- **seller-step-2.tsx** — Seller onboarding step 2
  - Verification documents
  - Payment setup
  - Terms acceptance

- **seller-step-3.tsx** — Seller onboarding step 3
  - Profile completion
  - Portfolio upload
  - Verification process

- **seller-step-4.tsx** — Seller onboarding step 4
  - Final verification
  - Account activation
  - Welcome dashboard

### /lib — Utility Libraries

- **db.ts** — Database connection
  - Prisma client initialization
  - Connection management
  - Error handling

- **auth.ts** — Authentication utilities
  - NextAuth.js configuration
  - OAuth provider setup
  - Session management
  - Role-based access control

- **stripe.ts** — Payment processing
  - Stripe client setup
  - Checkout session creation
  - Payment intent handling
  - Webhook processing

- **uploadthing.ts** — File upload utilities
  - UploadThing client setup
  - File validation
  - Upload handlers
  - Access control

- **uploadthing-config.ts** — UploadThing configuration
  - File type definitions
  - Size limits
  - Access permissions

- **ai-generator.ts** — AI integration
  - OpenAI client setup
  - Anthropic integration
  - Workflow generation
  - Natural language processing

- **runtime-engine.ts** — Workflow execution engine
  - vm2 sandbox setup
  - Security configurations
  - Execution monitoring
  - Error handling

- **rate-limit.ts** — Rate limiting utilities
  - Redis integration
  - Request limiting
  - IP-based restrictions
  - Custom rate limits

- **email.ts** — Email utilities
  - Resend integration
  - Template management
  - Email sending
  - Delivery tracking

- **utils.ts** — General utilities
  - Helper functions
  - Formatting utilities
  - Validation helpers
  - Common operations

### /prisma — Database Schema

- **schema.prisma** — Database schema definition
  - User model with roles and onboarding
  - Workflow model with versions and executions
  - Purchase and earnings tracking
  - Organization and team management
  - Review and rating system
  - Admin review and verification
  - Rate limiting and analytics

- **seed.ts** — Database seeding
  - Initial data population
  - Test user creation
  - Sample workflows
  - Tag and category setup

### /types — TypeScript Type Definitions

- **index.ts** — Type definitions and schemas
  - Zod validation schemas
  - Database model types
  - API response types
  - Role utility functions
  - Workflow execution types
  - User permission types

### /**tests** — Test Suite

#### /**tests**/api — API Tests

- **simple-auth.test.ts** — Authentication tests
  - Login/logout functionality
  - OAuth integration
  - Session management
  - Role validation

- **simple-workflow-upload.test.ts** — Workflow upload tests
  - File upload validation
  - Metadata handling
  - Error scenarios
  - Success cases

- **simple-purchasing.test.ts** — Purchase flow tests
  - Stripe integration
  - Payment processing
  - Purchase verification
  - Download access

- **workflow-listing.test.ts** — Workflow listing tests
  - Search functionality
  - Filtering options
  - Pagination
  - Sorting

- **workflow-fields.test.ts** — Workflow field validation
  - Required fields
  - Data validation
  - Error handling
  - Success cases

- **review-system.test.ts** — Review system tests
  - Review submission
  - Rating validation
  - Display functionality
  - Moderation

- **admin-role-management.test.ts** — Admin functionality tests
  - Role assignment
  - Permission checking
  - User management
  - Workflow approval

- **onboarding.test.ts** — Onboarding flow tests
  - Step progression
  - Data persistence
  - Validation
  - Completion

- **onboarding-status.test.ts** — Onboarding status tests
  - Progress tracking
  - Status checking
  - Completion validation

- **landing-page.test.ts** — Landing page tests
  - Component rendering
  - Navigation
  - Call-to-action
  - Responsive design

#### /**tests**/components — Component Tests

- **onboarding.test.tsx** — Onboarding component tests
  - Step navigation
  - Form validation
  - Data submission
  - Error handling

#### /**tests**/pages — Page Tests

- **onboarding-page.test.tsx** — Onboarding page tests
  - Page rendering
  - User interaction
  - State management
  - Navigation

#### /**tests**/lib — Library Tests

- **role-utils.test.ts** — Role utility tests
  - Role checking functions
  - Permission validation
  - Access control
  - Edge cases

- **utils.test.ts** — Utility function tests
  - Helper functions
  - Formatting utilities
  - Validation helpers
  - Common operations

#### /**tests**/types — Type Tests

- **index.test.ts** — Type definition tests
  - Schema validation
  - Type checking
  - Zod integration
  - Error handling

### /scripts — Development Scripts

- **cli.ts** — Command-line interface
  - Database management
  - User operations
  - Workflow management
  - System health checks
  - Deployment utilities

- **setup.sh** — Unix setup script
  - Environment setup
  - Dependency installation
  - Database initialization
  - Development configuration

- **setup.bat** — Windows setup script
  - Windows-specific setup
  - Environment configuration
  - Dependency management
  - Development tools

### /public — Static Assets

- **favicon.ico** — Site favicon
- **robots.txt** — Search engine directives
- **README.md** — Public directory documentation

### /github — CI/CD Configuration

#### /github/workflows

- **ci.yml** — Continuous integration
  - Automated testing
  - Code quality checks
  - Security scanning
  - Deployment preparation

### Configuration Files

- **.gitignore** — Git ignore patterns
  - Node modules
  - Environment files
  - Build artifacts
  - Log files

- **.dockerignore** — Docker ignore patterns
  - Development files
  - Test files
  - Documentation
  - Git history

- **.cursorrules** — Cursor IDE configuration
  - Code formatting rules
  - Linting configuration
  - Editor settings

- **components.json** — shadcn/ui configuration
  - Component library setup
  - Styling configuration
  - Theme customization

- **postcss.config.js** — PostCSS configuration
  - Tailwind CSS processing
  - Autoprefixer setup
  - CSS optimization

- **next-env.d.ts** — Next.js type definitions
  - TypeScript declarations
  - Next.js specific types
  - Environment variables

### Documentation Files

- **README.md** — Project overview and setup
- **SETUP.md** — Detailed setup instructions
- **DEPLOYMENT.md** — Deployment guide
- **QUICKSTART.md** — Quick start guide
- **CHANGES_SUMMARY.md** — Recent changes
- **FINAL_CHANGES_SUMMARY.md** — Final project changes
- **UI_UX_IMPROVEMENTS.md** — UI/UX enhancement details

## Project Architecture Summary

### Frontend Architecture

The application uses Next.js 14 with the App Router for a modern, server-side rendered experience. The UI is built with Tailwind CSS and shadcn/ui components, providing a consistent design system. React components are organized by feature and include comprehensive TypeScript typing.

### Backend Architecture

API routes are organized by feature in the `/app/api` directory, following RESTful conventions. The backend uses Prisma ORM for database operations, with PostgreSQL as the primary database. Authentication is handled by NextAuth.js with multiple OAuth providers.

### Database Design

The database schema supports multi-tenancy with organizations, comprehensive user management with roles, workflow versioning and execution tracking, payment processing with earnings calculation, and extensive analytics capabilities.

### Security Features

- Role-based access control
- Secure file uploads with validation
- Payment processing with Stripe
- Rate limiting with Redis
- Workflow execution sandboxing
- Input validation with Zod schemas

### Testing Strategy

Comprehensive test coverage includes unit tests for utilities, integration tests for API routes, component tests for UI elements, and end-to-end testing for critical user flows. Jest and React Testing Library provide the testing framework.

### Deployment Options

The application supports multiple deployment strategies including Vercel for frontend, Fly.io for full-stack deployment, Docker for containerized deployment, and traditional hosting with proper environment configuration.

This architecture provides a scalable, secure, and maintainable foundation for the WorkflowHub marketplace platform.
