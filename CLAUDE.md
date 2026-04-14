# CLAUDE.md — aaron-kr (Next.js frontend)

This file gives Claude context about this repository. Read it before making any changes.

## What this is

Next.js 15 personal site for Aaron Snowberger, Ph.D. Single-page homepage with scroll sections. Content for Design, Writing, and Beyond sections fetched from headless WordPress at `notes.aaron.kr`. Research, Teaching, and Labs sections are static. Deployed to Vercel with ISR.

## WordPress backend

**URL:** `https://notes.aaron.kr` (moved from `aaron.kr/content` — the `/content/` subdirectory no longer exists)
**REST API base:** `https://notes.aaron.kr/wp-json/wp/v2`
**Media files:** `https://files.aaron.kr/media/` (separate domain, unchanged)
**WP Admin:** `https://notes.aaron.kr/wp-admin`

The WP backend repo is `aaron-kr-wp`. The mu-plugin there registers custom post types and REST fields that this app consumes.

## Architecture rules to preserve

**Server components for data fetching.** `app/page.tsx` is a server component. It fetches from WordPress in parallel and passes data as props to section components. Do not move WP fetches into client components — that breaks ISR and exposes the API URL to the browser.

**Global CSS only — no Tailwind, no CSS modules.** The entire design system is in `app/globals.css`. It uses CSS custom properties extensively. Do not introduce Tailwind classes or inline styles that replicate what the CSS already does.

**`suppressHydrationWarning` on both `<html>` and `<body>`.** The anti-flash script mutates `data-theme`/`data-lang`/`data-aurora` on `<html>` before React hydrates. Browser extensions inject attributes on `<body>`. Both are intentional.

**`<link>` tags for fonts, not `next/font`.** `next/font` requires network access to Google Fonts at build time. CSS vars `--font-playfair`, `--font-dm`, `--font-kr` are set in a `<style>` block in `layout.tsx`.

**Static fallback data in every WP-powered component.** `Design.tsx`, `Writing.tsx`, and `Beyond.tsx` each have a `FALLBACK_*` constant that renders when `posts.length === 0`. Never remove them.

**ISR at 1 hour.** `next: { revalidate: 3600 }` on all WP fetches.

## File map

```
app/layout.tsx            Anti-flash script, font links, metadata, suppressHydrationWarning
app/page.tsx              Server component: parallel WP fetches, section assembly
app/globals.css           ENTIRE design system
app/[...segments]/
  page.tsx                Catch-all: handles /%category%/%postname%/ and CPT URLs

components/
  ClientInit.tsx          useEffect only: scroll progress + IntersectionObserver
  Nav.tsx                 'use client' — theme/lang/aurora toggles, mobile menu
  Hero.tsx                Static — no props
  WyoKoreaSlider.tsx      'use client' — range input → clipPath
  Research.tsx            Static — links to pailab.io
  Teaching.tsx            Static — links to courses.aaron.kr
  Labs.tsx                Static — links to pailab.io
  Design.tsx              Props: WPPost[] — WP portfolio + static fallback
  Writing.tsx             Props: WPPost[] — WP posts + static fallback
  Beyond.tsx              Props: WPPost[] — WP posts + static fallback
  Footer.tsx              Static server component
  QRModal.tsx             'use client' — opens via window event 'openQRModal'

lib/wordpress.ts          fetch wrappers, ISR, stripHtml with entity decode, helpers
types/wordpress.ts        WPPost interface with all mu-plugin custom fields
```

## URL and domain mapping

| Domain | Purpose |
|---|---|
| `aaron.kr` | Public frontend (Next.js on Vercel) |
| `notes.aaron.kr` | WordPress backend (Dreamhost VPS) |
| `files.aaron.kr` | Media library (all uploaded images/files) |
| `courses.aaron.kr` | Student course site (GitHub Pages CNAME) |
| `pailab.io` | Research lab site (Astro) |

**There is no `/content/` subdirectory.** WordPress previously lived at `aaron.kr/content/` but moved to `notes.aaron.kr` (root, no subdirectory). Any reference to `aaron.kr/content/` in the codebase is a stale URL that needs updating.

## WP data consumed

```typescript
getDesignPosts(4)     → /wp-json/wp/v2/portfolio
getWritingPosts()     → /wp-json/wp/v2/posts
getBeyondPosts(6)     → /wp-json/wp/v2/posts?categories=beyond
```

The `stripHtml()` function in `lib/wordpress.ts` handles both tag removal AND entity decoding (WP emits `&#8220;` etc.). Always use `stripHtml()`, never raw `.replace(/<[^>]*>/g, '')`.

## Catch-all route logic

`app/[...segments]/page.tsx` handles all post URLs. It takes the last segment as the WP slug and optionally uses the first segment as a CPT type hint:

```
/design/my-project  → slug: 'my-project', hint: try 'portfolio' first
/portfolio/my-item  → slug: 'my-item', hint: try 'portfolio' first
/research/paper     → slug: 'paper', hint: try 'research' first
/category/any-post  → slug: 'any-post', no CPT hint → tries all types
```

Search order: portfolio → research → talks → testimonials → courses → posts → pages.

## CSS design system

**Tokens:** All colors via CSS custom properties. Never hardcode colors.
**Fill-slide hover:** `.fs` (full fill, text → `--bg`) `.fss` (soft fill). Set `--sf` for fill color. Pre-built: `.sl-t` (teal), `.sl-b` (blue), `.sl-p` (purple), `.sl-pk` (pink).
**Rise animation:** `.rise` + `ClientInit.tsx` IntersectionObserver adds `.in`.
**Section labels:** `.sec-lbl` + `.bl` `.pu` `.pk` modifiers.

## QR Modal communication

Nav fires `window.dispatchEvent(new Event('openQRModal'))`. QRModal listens via `window.addEventListener`. Custom DOM event — no shared state or context needed.

## Remote image domains (next.config.ts)

- `notes.aaron.kr` — WP uploads
- `files.aaron.kr` — media library
- `i0.wp.com` — Jetpack CDN
- `aaron.kr` — legacy (pre-migration references)
- `aaronkr-courses.github.io` — university logos
- `aaronsnowberger.com` — client logos

## Common mistakes to avoid

- Don't reference `aaron.kr/content/` — that path no longer exists
- Don't use `lab.aaron.kr` — WordPress is at `notes.aaron.kr`
- Don't add `'use client'` to data-fetching components — breaks ISR
- Don't hardcode colors — use CSS custom properties
- Don't skip `stripHtml()` — WP titles contain HTML entities
- Don't set `revalidate: 0` — every request would hit WordPress
- Don't add Tailwind — globals.css is the complete design system
- Don't use `next/font` if the build environment has restricted network access

## Environment variables

```bash
WP_API_URL              # Base WP REST API URL — notes.aaron.kr in production
WP_PROJECT_POST_TYPE    # CPT slug for design posts (default: portfolio)
WP_BEYOND_CATEGORY      # Category slug for personal posts (default: beyond)
WP_WRITING_PER_PAGE     # Posts in Writing section (default: 8)
```
