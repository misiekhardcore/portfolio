# ADR 005: Docker Compose PostgreSQL on port 5433

**Status:** Accepted
**Date:** 2026-07-29

## Context

PostgreSQL is required for Payload CMS. A Docker container provides isolated,
reproducible development. The developer's machine already has a system-level
PostgreSQL occupying the default port 5432.

Options:
- Use the existing system PostgreSQL
- Use Docker on port 5432 (conflict)
- Use Docker on a non-default port

## Decision

**Run PostgreSQL in Docker on port 5433.** The container uses
`postgres:16-alpine` with persistent volume `pgdata`.

Connections bind to `127.0.0.1:5433` to avoid exposing the database to the
local network. The `DATABASE_URL` in `.env.local` explicitly includes the port:
`postgres://portfolio:portfolio_pwd@127.0.0.1:5433/portfolio`.

## Consequences

- **Positive:** No conflict with system PostgreSQL on 5432.
- **Positive:** Database resets with `docker compose down -v`. Reproducible
  for other developers.
- **Positive:** `127.0.0.1` binding prevents network access — database only
  reachable from localhost.
- **Negative:** Non-default port must be documented. `.env.example` records
  the expected value. Developers with 5432 available still use 5433 for
  consistency.
- **Negative:** Container must be started before `npm run dev` (`docker compose up -d`).

## Alternatives considered

| Alternative | Rejection reason |
|---|---|
| System PostgreSQL | No isolation, apps interact, cleanup and reset difficult |
| Docker on port 5432 | Conflicts with existing system PostgreSQL |
| SQLite | Rejected in ADR 001 — Payload 3 prefers PostgreSQL for production |
