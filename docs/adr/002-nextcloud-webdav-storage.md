# ADR 002: Nextcloud WebDAV for image storage

**Status:** Accepted
**Date:** 2026-07-29

## Context

The portfolio site needs image storage for project photos and site media.
Self-hosted Nextcloud instance is already available at `duivenkamp206.duckdns.org`
with sufficient storage. The site should not store images on the application
server.

The storage layer must integrate with Payload's upload lifecycle:
upload → store → generate resized variants → serve via proxied URL.

Options evaluated:

- **Nextcloud via custom storage adapter** — implement Payload's `GeneratedAdapter`
  with WebDAV PUT/GET/DELETE. Images served through server-side proxy.
- **AWS S3 / Cloudflare R2** — `@payloadcms/plugin-cloud-storage/s3` adapter.
- **Local filesystem** — Payload stores files on disk, served directly.
- **Cloudinary** — third-party image CDN.

## Decision

**Use Nextcloud WebDAV with a custom storage adapter.** The adapter implements
Payload's `GeneratedAdapter` interface and wraps `@payloadcms/plugin-cloud-storage`.

Architecture:
```
Admin upload → handleUpload() → WebDAV PUT → Nextcloud
Browser request → /api/images/[...path] → WebDAV GET → Nextcloud → response
Admin delete → handleDelete() → WebDAV DELETE → Nextcloud
```

Key implementation details:
- `disableLocalStorage: true` — Payload never writes files to disk
- `ensureDir()` auto-creates missing directories via MKCOL before PUT
- URL encoding on each path segment for filenames with spaces/special chars
- Folder structure: `Portfolio/{projects,site,media}/filename.jpg`
- Image variants (thumbnail, card, full) produced by sharp, uploaded individually

## Consequences

- **Positive:** No additional storage costs. Full control over image lifecycle.
  No vendor lock-in.
- **Positive:** Server-side image proxy → browser never sees Nextcloud URLs.
  Cache headers (`max-age=31536000, immutable`) prevent repeated requests.
- **Positive:** MKCOL auto-creation means no manual directory setup needed.
- **Negative:** Custom adapter maintenance burden — no community support.
- **Negative:** WebDAV latency adds ~200ms per request. Acceptable with
  aggressive browser caching.
- **Negative:** `FileData & TypeWithID` types from cloud-storage plugin don't
  include custom collection fields — requires `as unknown as Record<string, unknown>`
  casts for `doc.folder`.

## Alternatives considered

| Alternative | Rejection reason |
|---|---|
| S3 / R2 | Additional cost, unnecessary for low-traffic portfolio |
| Local filesystem | Files tied to app server, no persistence across deployments |
| Cloudinary | External dependency, bandwidth limits on free tier |
