# DIMATA Company Profile 2026 - System Documentation

> **Purpose:** Reference document for AI assistants to quickly understand the codebase without re-exploring.

## 1. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.10 (App Router, Turbopack) |
| React | 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + `@heroui/react` component library |
| Database | MariaDB (via `@prisma/adapter-mariadb` + `mariadb` driver) |
| ORM | Prisma 7.8 |
| Auth | JWT (jose) - httpOnly cookie `cms-token` |
| Email | Nodemailer (Gmail SMTP) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Dark Mode | next-themes (system/light/dark) |
| i18n | Custom context (Indonesian `id` / English `en`) |
| Deployment | VPS (Ubuntu) + Nginx + PM2 |

## 2. Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages (Navbar + Footer layout)
│   │   ├── page.tsx              # Home page
│   │   ├── about/page.tsx        # About + Gallery (fetches from DB)
│   │   ├── events/page.tsx       # Events listing
│   │   ├── events/[slug]/page.tsx # Event detail (ISR, revalidate=60)
│   │   ├── blog/page.tsx          # Blog listing
│   │   ├── blog/[slug]/page.tsx   # Blog detail (ISR, revalidate=60)
│   │   ├── project/page.tsx      # Projects listing
│   │   ├── pricing/page.tsx      # Pricing
│   │   ├── products/             # Product pages (aiso, hanoman, hairisma, prochain)
│   │   ├── career/page.tsx       # Career listing
│   │   ├── contact/page.tsx      # Contact form
│   │   ├── solutions/page.tsx    # Solutions page
│   │   ├── vision-mission/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   └── terms-of-service/page.tsx
│   ├── cms/                # CMS admin panel (sidebar layout, auth required)
│   │   ├── login/page.tsx        # Login page
│   │   ├── page.tsx              # Dashboard
│   │   ├── gallery/page.tsx      # Gallery management
│   │   ├── events/page.tsx       # Events CRUD
│   │   ├── project/page.tsx      # Projects CRUD
│   │   ├── pricing/page.tsx      # Pricing management
│   │   ├── blog/                 # Blog management (separate pages)
│   │   │   ├── page.tsx              # Blog posts list
│   │   │   ├── create/page.tsx       # Create post
│   │   │   └── [id]/edit/page.tsx    # Edit post
│   │   └── career/
│   │       ├── departments/page.tsx
│   │       └── jobs/page.tsx
│   ├── api/                # API routes
│   │   ├── auth/                 # Login, logout, me
│   │   ├── gallery/              # CRUD gallery images
│   │   ├── events/               # CRUD events + slug lookup
│   │   ├── project/              # CRUD projects
│   │   ├── pricing/              # CRUD pricing (products, tiers, features, etc)
│   │   ├── jobs/                 # CRUD jobs
│   │   ├── departments/          # CRUD departments
│   │   ├── blog/                 # Blog API (categories, posts, upload)
│   │   ├── upload/               # File upload (gallery, events, projects, blog)
│   │   ├── contact/              # Contact form submission
│   │   └── docs/                 # Swagger UI
│   ├── layout.tsx          # Root layout (ThemeProvider, LanguageProvider)
│   ├── sitemap.ts          # Dynamic sitemap
│   └── docs/page.tsx       # Swagger docs page
├── components/
│   ├── pages/              # Page-level client components
│   │   ├── home-page.tsx
│   │   ├── about-page.tsx
│   │   ├── events-page.tsx
│   │   ├── event-detail-page.tsx
│   │   ├── blog-page.tsx
│   │   ├── blog-detail-page.tsx
│   │   ├── project-page.tsx
│   │   ├── pricing-page.tsx
│   │   ├── career-page.tsx
│   │   ├── contact-page.tsx
│   │   ├── solutions-page.tsx
│   │   ├── products-page.tsx
│   │   ├── vision-mission-page.tsx
│   │   ├── privacy-policy-page.tsx
│   │   ├── terms-of-service-page.tsx
│   │   └── products/            # Product detail pages
│   ├── layouts/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── fragments/           # Reusable animated components
│   │   ├── animated-background.tsx
│   │   ├── scroll-motion.tsx
│   │   └── system-diagram.tsx
│   └── ui/
│       ├── theme-logo.tsx
│       └── whatsapp-float.tsx
├── contexts/
│   └── language-context.tsx  # i18n context (id/en)
├── hooks/                   # Custom hooks
├── lib/
│   ├── prisma.ts            # Prisma client (singleton, MariaDB adapter)
│   ├── auth.ts              # JWT sign/verify, getCurrentUser
│   ├── db-config.ts         # Parse DATABASE_URL to connection object
│   ├── gallery.ts           # getActiveGalleryImages()
│   ├── upload.ts            # File upload utilities
│   ├── mail.ts              # Nodemailer sendEmail()
│   └── swagger.ts           # Swagger config
├── locales/
│   ├── id.json              # Indonesian translations
│   └── en.json              # English translations
├── middleware.ts            # Auth middleware (PROTECTS CMS + API routes)
├── styles/
│   └── globals.css
public/
├── img/                     # Static images (logos, partners, clients, etc.)
│   ├── logo/
│   ├── client/
│   ├── partners/
│   ├── products/
│   └── founder.jpg
└── uploads/                 # User-uploaded files (served by nginx directly)
    ├── gallery/
    ├── events/
    ├── projects/
    └── blog/
```

## 3. Database Schema (Prisma + MariaDB)

### Core Models

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `Admin` | CMS admin users | email, password (bcrypt), name |
| `GalleryImage` | Gallery photos | filename, originalName, path, description, sortOrder, isActive |
| `Event` | Events/activities | slug (unique), title, description, content (HTML), image, location, registrationUrl, startDate, endDate, category, status, isActive |
| `Project` | Portfolio projects | slug (unique), titleId/titleEn, descriptionId/descriptionEn, client, category, technologies, image, status, externalUrl, sortOrder, isActive |
| `Department` | Job departments | nameId/nameEn, sortOrder, isActive |
| `Job` | Job postings | slug (unique), titleId/titleEn, departmentId (FK), location, type, summaryId/En, responsibilitiesId/En (JSON string), requirementsId/En (JSON string), applyUrl, sortOrder, isActive |

### Blog Models

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `BlogCategory` | Blog post categories | slug (unique), nameId/nameEn, sortOrder, isActive |
| `BlogPost` | Blog articles/news | slug (unique), title, content (LongText HTML), excerpt, image, authorName, authorPhoto, status (draft/published), publishedAt, isFeatured, sortOrder, isActive |
| `BlogPostCategory` | Many-to-many join | postId (FK), categoryId (FK), composite PK |

**Relations:** `BlogPost N:N BlogCategory` via `BlogPostCategory`. Blog uses single-language fields (like `Event`).

### Pricing Models

| Model | Purpose |
|-------|---------|
| `PricingProduct` | Products (ProChain, Hanoman, etc.) |
| `PricingTier` | Tiers per product (Standard/Professional/Premium per deployment) |
| `PricingFeature` | Features per tier |
| `PricingBundleFeature` | Bundle features per product |
| `PricingDiscount` | Volume discount rules |
| `PricingComparison` | Comparison table rows |

### i18n Pattern

Models like `Project`, `Job`, `Department` use `fieldId`/`fieldEn` naming convention for bilingual content. Jobs store `responsibilitiesId/En` and `requirementsId/En` as **JSON strings** (stringified arrays).

## 4. Authentication Flow

```
1. POST /api/auth/login → validates bcrypt password → sets httpOnly cookie "cms-token" (JWT, 24h expiry)
2. CMS layout checks GET /api/auth/me on mount → redirects to /cms/login if unauthorized
3. Middleware protects: /cms/*, /api/gallery/*, /api/upload/*, /api/events/* (POST/PUT/DELETE)
4. Public access: /api/events (GET), /api/gallery (GET), /api/contact
```

**Key files:**
- `src/middleware.ts` - Edge middleware with JWT verification
- `src/lib/auth.ts` - signToken, verifyToken, getCurrentUser
- `src/app/api/auth/login/route.ts` - Login endpoint
- `src/app/api/auth/me/route.ts` - Current user check

## 5. File Upload System

```
Upload Flow:
1. Client sends FormData to /api/upload (gallery) | /api/upload/events | /api/upload/project
2. API validates (MIME type, max 5MB), generates filename: {type}-{timestamp}-{random}.{ext}
3. Saves to public/uploads/{type}/ via fs.writeFile
4. Returns { path: "/uploads/{type}/{filename}" }
5. CMS frontend stores path in DB via gallery/events/project API

Serving:
- nginx serves /uploads/ directly from disk via "alias" directive (NOT proxied to Next.js)
- nginx config: location /uploads { alias /var/www/dimata-company-profile/public/uploads; }
```

**Key files:**
- `src/lib/upload.ts` - ensureUploadDir, generateFilename, saveFile, isImageFile
- `src/app/api/upload/route.ts` - Gallery upload
- `src/app/api/upload/events/route.ts` - Events upload
- `src/app/api/upload/project/route.ts` - Projects upload
- `src/app/api/blog/upload/route.ts` - Blog image upload

**Allowed types:** image/jpeg, image/png, image/webp, image/gif
**Max size:** 5MB
**Upload directories:** public/uploads/{gallery,events,projects,blog}/

## 6. API Routes Reference

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | No | Login, sets cookie |
| POST | `/api/auth/logout` | No | Logout, clears cookie |
| GET | `/api/auth/me` | Yes | Get current user |

### Gallery
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/gallery` | No | List all images (optional `?active=true`) |
| POST | `/api/gallery` | Yes | Create gallery record |
| PUT | `/api/gallery/[id]` | Yes | Update (toggle active, reorder) |
| DELETE | `/api/gallery/[id]` | Yes | Delete (also removes file from disk) |

### Events
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/events` | No | List events (optional `?status=`, `?active=true`) |
| POST | `/api/events` | Yes | Create event |
| GET | `/api/events/[id]` | No | Get event by ID |
| PUT | `/api/events/[id]` | Yes | Update event |
| DELETE | `/api/events/[id]` | Yes | Delete event |
| GET | `/api/events/slug/[slug]` | No | Get event by slug |

### Blog
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/blog/posts` | No | List posts (paginated, filter: `?category=`, `?status=`, `?active=`, `?page=`, `?limit=`) |
| POST | `/api/blog/posts` | Yes | Create post |
| GET | `/api/blog/posts/[id]` | No | Get post by ID |
| PUT | `/api/blog/posts/[id]` | Yes | Update post |
| DELETE | `/api/blog/posts/[id]` | Yes | Delete post |
| GET | `/api/blog/posts/slug/[slug]` | No | Get post by slug |
| GET | `/api/blog/categories` | No | List categories |
| POST | `/api/blog/categories` | Yes | Create category |
| PUT | `/api/blog/categories/[id]` | Yes | Update category |
| DELETE | `/api/blog/categories/[id]` | Yes | Delete category |
| POST | `/api/blog/upload` | Yes | Upload blog image |

### Projects

### Upload
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/upload` | Yes | Upload gallery image |
| POST | `/api/upload/events` | Yes | Upload event image |
| POST | `/api/upload/project` | Yes | Upload project image |

### Jobs & Departments
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET/POST | `/api/jobs` | No/Yes | List/Create jobs |
| GET/PUT/DELETE | `/api/jobs/[id]` | No/Yes | Job CRUD |
| GET/POST | `/api/departments` | No/Yes | List/Create departments |
| GET/PUT/DELETE | `/api/departments/[id]` | No/Yes | Department CRUD |

### Pricing
Full CRUD under `/api/pricing/*` for products, tiers, features, bundle-features, discounts, comparisons.

### Other
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/contact` | No | Submit contact form (sends email via SMTP) |

## 7. Key Conventions

### Component Pattern
- **Route pages** (`src/app/*/page.tsx`) are thin server components that fetch data and pass to client components
- **Client components** (`src/components/pages/*.tsx`) handle UI, interactivity, and client-side API calls
- All client components use `"use client"` directive

### Data Fetching
- **Server-side (SSR/ISR):** About page fetches gallery via Prisma directly (with `export const revalidate = 60`)
- **Client-side:** Events, Projects, Career pages fetch via `fetch()` in `useEffect` hooks
- **ISR pattern:** `export const revalidate = 60` on pages with server-side data fetching

### Internationalization (i18n)
- Language context at `src/contexts/language-context.tsx`
- Toggle via `useLanguage()` hook → `t("key")` function
- Locale stored in `localStorage("dimata-locale")`
- Default: Indonesian (`id`)
- Models use `fieldId`/`fieldEn` naming for bilingual content

### Styling
- Tailwind CSS 4
- `@heroui/react` for some UI components
- Dark mode via `next-themes` (class strategy)
- CMS panel forces light theme
- Public pages support system/light/dark

### File Naming
- Pages: `page.tsx` (Next.js convention)
- API routes: `route.ts`
- Components: kebab-case (`about-page.tsx`)
- Pages with dynamic segments: `[slug]/page.tsx`

## 8. Deployment

### Server Setup
- **OS:** Ubuntu VPS
- **Domain:** `cms.dimata.com`
- **Process Manager:** PM2 (app name: `dimata`)
- **Web Server:** Nginx (reverse proxy + static file serving)
- **SSL:** Let's Encrypt (Certbot)

### Nginx Configuration (`/etc/nginx/sites-available/dimata`)
```nginx
# Static files served directly by nginx (NOT proxied to Next.js)
location /uploads {
    alias /var/www/dimata-company-profile/public/uploads;
    expires 30d;
    add_header Cache-Control "public";
}

# Everything else proxied to Next.js
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Deploy Commands
```bash
# On server
cd /var/www/dimata-company-profile
git pull
npx prisma db push        # If schema changed
npm run build
pm2 restart dimata

# Nginx
nginx -t && systemctl reload nginx
```

### Important Notes
- **File uploads:** nginx serves `/uploads/` directly via `alias` directive. Do NOT proxy to Next.js.
- **Database:** MariaDB on localhost:3306, database name `dimata_cms`
- **Environment:** `.env` or `.env.local` on server (not committed to git)
- **Middleware:** `src/middleware.ts` (deprecated name in Next.js16, should be renamed to `proxy.ts`)

## 9. Known Issues & TODOs

| Issue | Status | Notes |
|-------|--------|-------|
| Middleware deprecation | Pending | Next.js16 wants `proxy.ts` instead of `middleware.ts` |
| `process.cwd()` in upload.ts | Caution | Uses `process.cwd()` which depends on PM2 working directory |
| Events detail page | Done | `src/app/(public)/events/[slug]/page.tsx` with ISR |
| Gallery ISR | Done | About page uses `revalidate = 60` |
| Registration URL for events | Done | `registrationUrl` field, conditional button |
| Blog feature | Done | Blog posts, categories, pagination, author, draft/publish, featured posts |

## 10. Environment Variables

```env
DATABASE_URL="mysql://root:password@localhost:3306/dimata_cms"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=your-email@gmail.com
SMTP_TO=recipient@gmail.com
CMS_ADMIN_EMAIL=admin@dimata.com
CMS_ADMIN_PASSWORD=your-secure-password
CMS_ADMIN_NAME=Admin
JWT_SECRET=your-random-secret-min-32-characters
NEXT_PUBLIC_SITE_URL=https://cms.dimata.com
```

## 11. Seed Data

Run `npx tsx prisma/seed.ts` to seed:
- Admin user (from env vars)
- Sample events (6 events with HTML content)
- Departments (Engineering, Product & Design, Sales & Marketing, Operations)
- Jobs (8 positions with bilingual content)

Run `npx tsx prisma/seed-blog.ts` to seed:
- 5 categories (Bisnis & Ekonomi, Digital & Informasi, Teknologi, Tutorial & Tips, Press Release)
- 5 sample blog posts with HTML content and category assignments
