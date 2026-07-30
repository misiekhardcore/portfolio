# ADR 001: Payload CMS with PostgreSQL as content backend

**Status:** Accepted
**Date:** 2026-07-29

## Context

The portfolio site needs a content management system for projects, media, and
categories. The site is built with Next.js 16 (App Router), and content must be
editable by a non-technical user through a web admin panel.

Options evaluated:

- **Payload CMS 3** — self-hosted, runs in-process with Next.js, uses PostgreSQL via Drizzle ORM, provides auto-generated admin UI, rich text (Lexical), and media management with sharp image resizing.
- **Strapi** — separate Node.js process, requires additional deployment infrastructure, heavier admin UI.
- **Sanity** — hosted CMS, vendor lock-in, content served via CDN not from own domain.
- **Contentlayer / MDX files** — no admin UI, requires git-based workflow unsuitable for non-technical content editors.

## Decision

**Use Payload CMS 3 with PostgreSQL.** Payload runs in the same Next.js process
(App Router), shares TypeScript types via `payload-types.ts`, and provides an
auto-generated admin panel at `/admin`.

PostgreSQL is chosen over SQLite because:

1. Payload 3 recommends PostgreSQL for production (`@payloadcms/db-postgres` is
   the primary adapter).
2. JSONB support for rich text and array fields.
3. Docker Compose provides reproducible local development.

The database adapter uses `node-postgres` pool with `DATABASE_URL` from env.

## Consequences

- **Positive:** Single process — no separate CMS server to deploy. Admin UI
  auto-generated from collection schemas. Shared types between frontend and
  admin via `tsconfig.json` path alias.
- **Positive:** Rich text editing via Lexical with serialized output rendered
  in React components.
- **Positive:** Sharp integration for automatic image resizing (thumbnail, card,
  full variants).
- **Negative:** Cold start latency — `getPayload({ config })` initializes the
  Postgres pool. First request after server start is slower.
- **Negative:** Database must be available for admin panel to render (cannot
  show read-only public pages without a running PostgreSQL in dev).

## Alternatives considered

| Alternative | Rejection reason |
|---|---|
| Strapi | Separate deployment, heavier, no in-process Next.js integration |
| Sanity | Hosted, vendor-lock, CDN delivery not under own domain |
| Contentlayer / MDX | No admin UI for non-technical editors |
| SQLite | Not recommended for Payload 3 production; PostgreSQL JSONB preferred |
