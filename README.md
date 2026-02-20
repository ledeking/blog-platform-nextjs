# Blog Platform NextJS

A modern, production-ready blog platform and lightweight CMS built with Next.js 15+, featuring a clean admin interface, SEO optimization, and markdown support. Perfect for a senior fullstack engineer's portfolio project.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.1-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### Public Features
- ✅ **Home Page** - Featured posts, latest posts grid, categories sidebar, newsletter signup
- ✅ **Blog Listing** - Paginated list of all published posts with search
- ✅ **Post Detail** - Full markdown rendering, table of contents, author info, reading time, related posts
- ✅ **Categories & Tags** - Browse posts by category or tag
- ✅ **SEO Optimized** - Dynamic metadata, OpenGraph tags, canonical URLs, sitemap.xml, robots.txt
- ✅ **RSS Feed** - `/feed.xml` for RSS readers
- ✅ **Responsive Design** - Mobile-first, fully responsive
- ✅ **Dark Mode** - System preference-based theme switching
- ✅ **Markdown Support** - Rich markdown with syntax highlighting

### Admin / CMS Features
- ✅ **Dashboard** - Overview stats (total posts, drafts, published, scheduled)
- ✅ **Post Management** - Create, edit, delete posts with full CRUD
- ✅ **Category Management** - CRUD operations for categories
- ✅ **Tag Management** - CRUD operations for tags
- ✅ **Rich Editor** - Markdown editor for post content
- ✅ **Post Status** - Draft, Published, Scheduled with publish dates
- ✅ **SEO Fields** - Meta title, description, canonical URL per post
- ✅ **Media Support** - Cover image URLs (Cloudinary/Vercel Blob ready)
- ✅ **Settings Page** - Placeholder for site settings

### Technical Features
- **Next.js 15+** with App Router and React Server Components
- **TypeScript** with strict mode
- **Prisma ORM** with PostgreSQL
- **Clerk Authentication** - Secure user management
- **Server Actions** - Type-safe data mutations
- **Markdown Rendering** - react-markdown with syntax highlighting
- **SEO** - Full metadata API, dynamic sitemap, RSS feed
- **Performance** - Streaming, Suspense, loading states
- **Security** - Input validation, route protection, sanitized HTML

## 🚀 Tech Stack

### Frontend
- **Next.js 15.1** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5.7** - Type safety
- **Tailwind CSS 4.0** - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI** - Accessible component primitives
- **react-markdown** - Markdown rendering
- **rehype-highlight** - Syntax highlighting
- **sonner** - Toast notifications
- **lucide-react** - Icon library
- **date-fns** - Date formatting

### Backend
- **Next.js Server Actions** - API endpoints
- **Prisma 6.1** - ORM and database toolkit
- **PostgreSQL** - Database
- **Clerk** - Authentication

### Development Tools
- **Turbopack** - Fast bundler (dev mode)
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Faker.js** - Seed data generation

## 📁 Project Structure

```
blog-platform-nextjs/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public route group
│   │   ├── page.tsx             # Home page
│   │   ├── blog/                # Blog pages
│   │   ├── categories/          # Category pages
│   │   ├── tags/                # Tag pages
│   │   ├── about/               # About page
│   │   └── contact/             # Contact page
│   ├── (admin)/                 # Admin route group
│   │   └── admin/               # Admin pages
│   ├── feed.xml/                # RSS feed route
│   ├── layout.tsx               # Root layout
│   ├── sitemap.ts               # Sitemap generation
│   └── robots.ts                # Robots.txt
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── layout/                  # Layout components
│   ├── blog/                    # Blog-specific components
│   └── admin/                   # Admin components
├── lib/                         # Utilities
│   ├── db.ts                    # Prisma client
│   ├── auth.ts                  # Auth utilities
│   ├── utils.ts                 # Helper functions
│   └── constants.ts             # Constants
├── actions/                     # Server actions
│   ├── posts.ts                 # Post actions
│   ├── categories.ts            # Category actions
│   └── tags.ts                  # Tag actions
├── prisma/                      # Prisma files
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed script
└── public/                      # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or cloud)
- Clerk account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-platform-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/blog?schema=public"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Optional: Cloudinary for image uploads
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed the database
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contact

- Telegram: https://t.me/ledeking
- Twitter: https://x.com/ledeking_
