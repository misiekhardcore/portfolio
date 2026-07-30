# ADR 003: Route group separation for frontend and Payload

**Status:** Accepted
**Date:** 2026-07-29

## Context

Next.js App Router requires a single root layout. But the public portfolio
pages need site chrome (Navbar + Footer) while the Payload admin needs its own
layout provided by `@payloadcms/next`. Both cannot coexist in the root layout
without conditional rendering that would leak admin chrome into public pages.

## Decision

**Use Next.js route groups to separate frontend and admin layouts.**

```
src/app/
├── layout.tsx              # root: <html><body>{children}</body></html>
├── (frontend)/             # public site pages
│   ├── layout.tsx          # Navbar + Footer wrapper
│   ├── page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── projects/page.tsx
├── (payload)/              # Payload admin + REST API
│   ├── layout.tsx
│   ├── admin/[[...segments]]/page.tsx
│   └── api/[...slug]/route.ts
└── api/images/             # proxy route (no layout needed)
```

The root layout contains only `<html>` and `<body>` tags.

`(frontend)/layout.tsx` wraps all public pages with `<Navbar />` + `{children}` + `<Footer />`.

`(payload)/layout.tsx` is the Payload blank template layout — handles admin
chrome, login screen, and REST API routing.

## Consequences

- **Positive:** Clean separation — no conditional layout logic, no admin CSS
  leaking into public pages.
- **Positive:** URL structure unchanged — `(frontend)` and `(payload)` are
  virtual route groups that don't affect URLs. `/about` stays `/about`,
  `/admin` stays `/admin`.
- **Positive:** Any new public page added under `(frontend)/` automatically
  gets site chrome.
- **Negative:** Two layouts to maintain. But Payload layout is template code
  from the blank starter — never manually edited.

## Alternatives considered

| Alternative | Rejection reason |
|---|---|
| Conditional root layout | Complex, fragile, admin chrome leakage risk |
| Separate Next.js apps | Deployment complexity, no shared types |
| Payload as separate express server | Extra deployment, lose in-process benefits |
