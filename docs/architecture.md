# Architecture

## System Overview

The product uses a modular monorepo:

- `apps/api`: Express + TypeScript backend exposing REST APIs and OpenAPI documentation.
- `apps/web`: Next.js dashboard for analytics, budgets, reports, and settings.
- `apps/mobile`: Flutter mobile app with Riverpod state management and offline cache extension points.
- `docs/database-schema.sql`: normalized PostgreSQL schema.

## Backend Layers

- Routes: HTTP concerns, validation, pagination, filters.
- Controllers: request orchestration.
- Services: business rules and use cases.
- Repositories: data access boundaries.
- Middleware: auth, errors, rate limits, validation.
- Domain DTOs: typed request and response models.

## Authentication Flow

1. User signs up or logs in.
2. API returns a short-lived access token and long-lived refresh token.
3. Client stores access token in memory and refresh token in secure storage.
4. Refresh endpoint rotates refresh tokens and invalidates reused tokens.
5. Mobile can unlock secure storage with biometric authentication before restoring a session.
6. Google and Apple login can exchange provider identity tokens for local JWTs through the social auth endpoint.

## Data Strategy

PostgreSQL is the source of truth. Flutter uses SQLite for offline expense drafts and pending mutations. Sync should use idempotent mutation IDs and server-side conflict resolution by `updated_at`.

## Security Controls

- Argon2 password hashing.
- JWT token rotation.
- Strict input validation with Zod.
- Rate-limited auth routes.
- Helmet security headers.
- CORS allow-list.
- Parameterized ORM queries.
- Audit-friendly timestamps.
- Privacy controls for export and account deletion.

## AI Insights

The first implementation includes a deterministic insights engine that compares current and prior month spending, category budget usage, recurring expenses, and projected month-end spend. It is intentionally explainable and can later be backed by an LLM or forecasting model.
