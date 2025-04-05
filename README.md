# Healthcare Monitoring System

A real-time patient monitoring system built with React, Supabase, and Prisma.

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Supabase CLI
- Prisma CLI

## Environment Setup

1. Clone the repository
2. Create a `.env` file in the root directory with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/healthcare_db"
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## Database Setup

1. Create a new database:

```sql
CREATE DATABASE healthcare_db;
```

2. Initialize Prisma:

```bash
npx prisma init
```

3. Run migrations:

```bash
npx prisma migrate dev
```

4. Generate Prisma Client:

```bash
npx prisma generate
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

## Supabase Setup

1. Create a new Supabase project
2. Connect to Supabase:
   - Click "Connect to Supabase" in the top right
   - Follow the authentication flow
3. Apply migrations:
   - Migrations will be automatically applied
   - Check Supabase dashboard to verify tables are created

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/    # Reusable components
│   ├── pages/         # Page components
│   ├── lib/          # Utilities and configurations
│   └── types/        # TypeScript type definitions
├── prisma/
│   └── schema.prisma # Database schema
└── supabase/
    └── migrations/   # Database migrations
```