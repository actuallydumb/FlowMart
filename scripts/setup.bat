@echo off
echo 🚀 Setting up WorkflowHub...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env.local exists
if not exist ".env.local" (
    echo 📝 Creating .env.local from template...
    copy env.example .env.local
    echo ⚠️  Please edit .env.local with your configuration before continuing.
    echo    Required: DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
    echo.
    pause
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npm run db:generate

REM Check if database is accessible
echo 🗄️  Testing database connection...
npm run db:push >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Database connection successful
) else (
    echo ❌ Database connection failed. Please check your DATABASE_URL in .env.local
    echo    Make sure PostgreSQL is running and the database exists.
    pause
    exit /b 1
)

REM Seed the database
echo 🌱 Seeding database with sample data...
npm run db:seed

echo.
echo 🎉 Setup complete! You can now run the application:
echo.
echo    npm run dev
echo.
echo Then open http://localhost:3000 in your browser.
echo.
echo 📚 For detailed setup instructions, see SETUP.md
pause 