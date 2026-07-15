# Dimata Company Profile 2026

Company profile website for Dimata IT Solutions, built with Next.js App Router.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **React**: 19.2
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Library**: HeroUI v3
- **Animation**: Framer Motion
- **ORM**: Prisma 7 (MySQL adapter)
- **Auth**: JWT (jose) + httpOnly cookie
- **Image Crop**: react-easy-crop

## Prerequisites

- Node.js 18+
- MySQL 8 running on localhost:3306
- npm or yarn

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd dimata-company-profile-2026

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your actual values

# Run database migration
npx prisma migrate dev

# Seed admin user
npx prisma db seed

# Start development server
npm run dev
```

## Environment Variables

All variables are in a single `.env` file.

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://root:password@localhost:3306/dimata_cms` |
| `SMTP_HOST` | Gmail SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | Gmail address | `your-email@gmail.com` |
| `SMTP_PASS` | Gmail app password | `your-16-char-app-password` |
| `SMTP_FROM` | Sender email | `your-email@gmail.com` |
| `SMTP_TO` | Recipient email | `recipient@gmail.com` |
| `CMS_ADMIN_EMAIL` | CMS login email | `admin@dimata.com` |
| `CMS_ADMIN_PASSWORD` | CMS login password | `your-secure-password` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-random-secret` |

> **Note**: If you also have `.env.local`, it will override `.env` values. This is useful for local development with different settings.

## Database Setup

```bash
# Create database and run migrations
npx prisma migrate dev

# Seed admin user (reads CMS_ADMIN_EMAIL & CMS_ADMIN_PASSWORD from .env)
npx prisma db seed

# Open Prisma Studio (visual DB browser)
npx prisma studio
```

The seed script creates an admin user with credentials from `.env`.

## Development

```bash
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## CMS Admin

Access the CMS at `/cms`.

| Field | Value |
|-------|-------|
| URL | `http://localhost:3000/cms` |
| Email | From `CMS_ADMIN_EMAIL` in `.env` |
| Password | From `CMS_ADMIN_PASSWORD` in `.env` |

### Features

- **Dashboard**: Overview stats
- **Gallery**: Upload, edit, delete, reorder images
- **Image Crop**: Crop images before upload
- **Sort Order**: Lower number = displayed first (0 = first, 1 = second, ...)
- **Toggle Visibility**: Show/hide images on public site

## Project Structure

```
dimata-company-profile-2026/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed admin user
│   └── migrations/            # Migration files
├── public/
│   └── uploads/gallery/       # Uploaded gallery images
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/     # POST: login
│   │   │   │   ├── logout/    # POST: logout
│   │   │   │   └── me/        # GET: current user
│   │   │   ├── gallery/       # CRUD gallery images
│   │   │   └── upload/        # POST: file upload
│   │   ├── about/             # About page (SSR gallery)
│   │   ├── cms/
│   │   │   ├── login/         # CMS login page
│   │   │   └── gallery/       # Gallery management
│   │   ├── contact/           # Contact page
│   │   ├── products/          # Products page
│   │   ├── solutions/         # Solutions page
│   │   └── vision-mission/    # Vision & Mission page
│   ├── components/
│   │   ├── layouts/           # Navbar, Footer
│   │   ├── pages/             # Page components
│   │   └── ui/                # Reusable UI components
│   ├── contexts/
│   │   └── language-context.tsx  # i18n (ID/EN)
│   ├── lib/
│   │   ├── auth.ts            # JWT helpers
│   │   ├── gallery.ts         # Gallery DB queries
│   │   ├── mail.ts            # Nodemailer setup
│   │   ├── prisma.ts          # Prisma client
│   │   └── upload.ts          # File upload helpers
│   ├── locales/               # Translation files
│   │   ├── id.json
│   │   └── en.json
│   └── middleware.ts           # Auth middleware
├── .env                       # Environment variables
├── .env.example               # Environment template
├── deployment.md              # VPS deployment guide
└── package.json
```

## Features

### Public Pages

- **Home**: Hero, stats, products, CTA
- **About**: Founder, timeline, team, gallery (SSR from DB)
- **Products**: 4 solution sections, accounting, why choose us
- **Solutions**: Overview cards
- **Vision & Mission**: Visi/Misi cards, support services
- **Contact**: Form with email notification

### Technical

- **i18n**: Indonesian (default) / English toggle
- **Dark Mode**: System preference + manual toggle
- **SSR Gallery**: Server-side rendered for SEO
- **Image Optimization**: Client-side crop + resize
- **Auth**: JWT + httpOnly cookie, protected routes

## Deployment

### Quick Start

```bash
npm run build
npm run start
```

### VPS Deployment (Ubuntu 22.04 + Nginx)

For production deployment to VPS, see [deployment.md](deployment.md).

Covers:
- Server setup (Node.js, PM2, Nginx, MySQL)
- SSL certificate (Let's Encrypt)
- PM2 process management
- Nginx reverse proxy configuration
- Backup and troubleshooting

## License

Private - Dimata IT Solutions
