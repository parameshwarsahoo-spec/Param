# Sahonomics FinPilot

Production-ready cross-platform personal finance tracker with:

- Express + TypeScript REST API
- PostgreSQL primary database
- Next.js + Tailwind CSS web dashboard
- Flutter mobile app skeleton with offline-first SQLite cache hooks
- JWT access/refresh authentication, social-login extension points, biometric-ready mobile auth
- Docker, CI, OpenAPI docs, database schema, tests, and deployment notes

## Monorepo

```text
apps/
  api/      Node.js Express backend
  web/      Next.js dashboard
  mobile/   Flutter app
docs/
  architecture.md
  deployment.md
  database-schema.sql
.github/workflows/ci.yml
docker-compose.yml
```

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

Services:

- API: http://localhost:4000
- API docs: http://localhost:4000/docs
- Web: http://localhost:3000
- PostgreSQL: localhost:5432

## Web Preview Without Node Tooling

This workspace also includes a dependency-free static public web build at:

```text
apps/web-static/index.html
```

Upload the contents of `apps/web-static` to any static host such as Netlify Drop, Vercel static output, GitHub Pages, Cloudflare Pages, Firebase Hosting, or S3 + CloudFront. Open `index.html` directly in a browser to preview the dashboard UI when `npm` is unavailable on the machine.

## Local Development

Backend:

```bash
cd apps/api
npm install
npm run dev
```

Web:

```bash
cd apps/web
npm install
npm run dev
```

Mobile:

```bash
cd apps/mobile
flutter pub get
flutter run
```

## Security Baseline

- Passwords hashed with Argon2
- JWT access tokens and hashed refresh token rotation
- Helmet HTTP headers
- CORS allow-listing
- Rate limiting
- Zod validation at API boundary
- Parameterized database access through Prisma
- Encrypted mobile storage hooks
- Privacy export/delete endpoints planned in settings module

## Implemented First Pass

- Project architecture and folder structure
- Normalized database schema
- Backend setup with REST API modules
- Authentication flow with refresh tokens
- Expense CRUD APIs with search, filters, pagination, recurring expense fields, receipt URL metadata
- Income and budget APIs
- Analytics summary and AI-style insights engine
- Reports CSV/PDF placeholders and export wiring
- Dashboard UI for web
- Flutter mobile app skeleton with dashboard, expenses, analytics, budgets, reports, and settings screens

See [docs/architecture.md](docs/architecture.md) and [docs/deployment.md](docs/deployment.md).
