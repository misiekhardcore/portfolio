# ADR 004: Server-side image proxy with immutable caching

**Status:** Accepted
**Date:** 2026-07-29

## Context

Images are stored on Nextcloud and must be displayed on the public portfolio
site. Exposing raw Nextcloud WebDAV URLs to the browser leaks credentials and
reveals internal infrastructure. Additionally, serving images directly from
Nextcloud on every request wastes bandwidth and adds latency.

## Decision

**Proxy all image requests through `/api/images/[...path]` with aggressive caching.**

```
Browser → /api/images/projects/photo.jpg → WebDAV GET Nextcloud → Cache-Control: immutable → Browser
```

Implementation:
- Server-side route handler reads path segments, constructs WebDAV URL
- Fetches image from Nextcloud via `getFile()` helper with Basic auth
- Returns image buffer with:
  - `Content-Type` matching the source MIME type
  - `Cache-Control: public, max-age=31536000, immutable`
- On fetch failure: `notFound()` for 404, 502 for other errors

Frontend components use `<ProjectImage>` which wraps Next.js `next/image`:
- `loading="lazy"` by default (built into `next/image`)
- `priority` prop for hero images disables lazy loading
- `src` always goes through `/api/images/...`

## Consequences

- **Positive:** Browser caches images for one year (immutable). Subsequent
  visits load from cache — zero server requests.
- **Positive:** Nextcloud credentials never exposed to client. Internal
  infrastructure hidden.
- **Positive:** `next/image` handles responsive sizing, WebP conversion, and
  lazy loading automatically.
- **Negative:** First request per-image requires full proxy round-trip.
  Acceptable for portfolio with limited image count.
- **Negative:** Cache invalidation requires cache-busting in filenames or URL
  params if images change. Acceptable — project images are rarely updated.

## Alternatives considered

| Alternative | Rejection reason |
|---|---|
| Direct WebDAV URLs | Exposes credentials and infrastructure |
| Nextcloud share links | Public but generate complex URLs, no content-type control |
| S3 pre-signed URLs | Requires S3 setup (rejected in ADR 002) |
| Next.js Image Optimization API | Doesn't support external WebDAV sources directly |
