# Deployment Guide

## Docker

```bash
cp .env.example .env
docker compose up --build
```

## API Deployment

Recommended targets: AWS ECS/Fargate, Fly.io, Render, Railway, or Supabase Edge-compatible container hosting.

Required environment variables:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGINS`
- `PORT`

Run database migrations before promoting a release:

```bash
cd apps/api
npm run prisma:migrate
```

## Web Deployment

Recommended target: Vercel.

Set:

- `NEXT_PUBLIC_API_URL`

## Mobile Deployment

Android:

```bash
cd apps/mobile
flutter build appbundle --release
```

iOS:

```bash
cd apps/mobile
flutter build ipa --release
```

Configure Google Sign-In, Apple Sign-In, push notification credentials, and biometric entitlements in platform-specific files before store submission.

## CI/CD

GitHub Actions runs:

- API install, typecheck, lint, tests
- Web install, lint, build
- Docker build validation

Add deployment jobs after secrets are configured.
