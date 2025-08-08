# ⚡ Quick Start Guide

Get WorkflowHub running in 5 minutes!

## 🚀 Quick Setup

### 1. Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd workflowhub
npm install
```

### 3. Environment Setup

```bash
cp env.example .env.local
```

Edit `.env.local` with your database URL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/workflowhub"


NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🔧 Automated Setup

### macOS/Linux

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Windows

```bash
scripts/setup.bat
```

## 📋 What You Get

✅ **Landing Page** - Modern homepage with features and testimonials  
✅ **Authentication** - Google OAuth sign-in  
✅ **Marketplace** - Browse and search workflows  
✅ **Dashboard** - Upload and manage workflows  
✅ **Admin Panel** - Approve workflows and manage users  
✅ **Responsive Design** - Works on all devices

## 🧪 Test the App

1. **Landing Page**: Visit http://localhost:3000
2. **Marketplace**: Click "Browse Workflows" or visit /marketplace
3. **Authentication**: Click "Get Started" to test Google OAuth
4. **Dashboard**: Sign in and visit /dashboard
5. **Admin**: Sign in with admin role and visit /admin

## 🐛 Need Help?

- Check the console for errors
- Verify your database connection
- Make sure environment variables are set
- See `SETUP.md` for detailed instructions

## 🚀 Next Steps

1. **Add Google OAuth**: Set up Google Cloud Console credentials
2. **Add Payments**: Configure Stripe for real payments
3. **Add File Upload**: Set up UploadThing for file storage
4. **Deploy**: Push to GitHub and deploy on Vercel

---

**That's it!** Your WorkflowHub application is now running locally. 🎉
