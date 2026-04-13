# CLAUDE.md — aaron-kr (Next.js frontend)

This file gives Claude context about this repository. Read it before making any changes.

## What this is

Next.js 15 personal site for Aaron Snowberger, Ph.D. Single-page homepage with scroll sections. Content for Design, Writing, and Beyond sections fetched from headless WordPress. Research, Teaching, and Labs sections are static (maintained in component files). Deployed to Vercel with ISR.

## Architecture decisions to preserve

**Server components for data fetching.** `app/page.tsx` is a server component. It fetches from WordPress in parallel and passes data as props to section components. Do not move WP fetches into client components — that would break ISR and expose the API URL to the browser.

**Global CSS only — no Tailwind, no CSS modules.** The entire design system is in `app/globals.css`. It uses CSS custom properties extensively. Do not introduce Tailwind classes or inline styles that replicate what the CSS already does. If you need a new component, add CSS classes to `globals.css` following the existing naming conventions.

**`suppressHydrationWarning` on both `<html>` and `<body>`.** The anti-flash script mutates `data-theme`/`data-lang`/`data-aurora` on `<html>` before React hydrates. Browser extensions (Grammarly, etc.) inject attributes on `<body>`. Both cause false hydration warnings. These suppressions are intentional and correct.

**`<link>` tags for fonts, not `next/font`.** `next/font` downloads font files from Google at build time, requiring network access to Google Fonts servers. Using standard `<link>` tags works in all environments without build-time network dependencies. The CSS vars `--font-playfair`, `--font-dm`, `--font-kr` are set in a `<style>` block in `layout.tsx`.

**Static fallback data in every WP-powered component.** `Design.tsx`, `Writing.tsx`, and `Beyond.tsx` each have a `FALLBACK_*` constant. If `posts.length === 0` (WordPress offline, network error, or local dev without WP configured), the component renders the fallback. Never remove the fallbacks.

**ISR at 1 hour.** `next: { revalidate: 3600 }` on all WP fetches. Do not reduce this to 0 or remove it — that would make every page request hit WordPress.

## File map

```
app/layout.tsx          Anti-flash script, font links, metadata, suppressHydrationWarning
app/page.tsx            Server component: parallel WP fetches, section assembly
app/globals.css         ENTIRE design system — tokens, components, responsive

components/
  ClientInit.tsx        useEffect only: scroll progress bar + IntersectionObserver
  Nav.tsx               'use client' — theme/lang/aurora toggles, mobile menu
  Hero.tsx              Static server component — no props
  WyoKoreaSlider.tsx    'use client' — range input → clipPath on cmpRight div
  Research.tsx          Static server component — links to pailab.io
  Teaching.tsx          Static server component — links to courses.aaron.kr
  Labs.tsx              Static server component — links to pailab.io
  Design.tsx            Props: WPPost[] — WP portfolio + static fallback
  Writing.tsx           Props: WPPost[] — WP posts + static fallback
  Beyond.tsx            Props: WPPost[] — WP posts + static fallback
  Footer.tsx            Static server component
  QRModal.tsx           'use client' — opens via window event 'openQRModal'

lib/wordpress.ts        fetch wrappers with ISR, stripHtml with entity decode
types/wordpress.ts      WPPost interface with all mu-plugin custom fields
```

## CSS design system — key patterns

**Tokens:** All colors and surfaces via CSS custom properties. `[data-theme="dark"]` and `[data-theme="light"]` on `<html>`. Never hardcode colors.

**Fill-slide hover:** `.fs` (full color fill, text goes to `--bg`) and `.fss` (soft fill, text unchanged). Set `--sf` CSS var on the element for fill color. Pre-built color variants: `.sl-t` (teal), `.sl-b` (blue), `.sl-p` (purple), `.sl-pk` (pink).

**Bilingual:** `.en` / `.ko` class siblings. CSS handles visibility via `[data-lang]` attribute.

**Rise animation:** `.rise` starts invisible. `ClientInit.tsx` observes them and adds `.in` class when they enter viewport.

**Section labels:** `.sec-lbl` — small caps with a colored line prefix. Add `.bl`, `.pu`, `.pk` for blue/purple/pink variants.

**List gradient rule:** `.gli::after` pseudo-element animates `width: 0 → 100%` on hover, drawing a gradient line at the bottom.

## WP data consumed

```typescript
// lib/wordpress.ts

getDesignPosts(4)     // → /wp-json/wp/v2/portfolio
getWritingPosts()     // → /wp-json/wp/v2/posts
getBeyondPosts(6)     // → /wp-json/wp/v2/posts?categories=beyond
```

Custom fields from the WP mu-plugin that components use:
- `featured_image_urls.large` — no `_embed` needed, inline in response
- `excerpt_plain` — HTML-stripped, 160 char max
- `reading_time_minutes` — integer minutes

The `stripHtml()` function in `lib/wordpress.ts` handles both tag removal AND HTML entity decoding (WP emits `&#8220;` etc. via `wptexturize`). Do not use `.replace(/<[^>]*>/g, '')` directly — use `stripHtml()`.

## QR Modal communication pattern

The QR button is in `Nav.tsx` (client component). The modal is `QRModal.tsx` (separate client component). They communicate via a custom DOM event rather than shared state:

```typescript
// Nav.tsx — fires the event
window.dispatchEvent(new Event('openQRModal'))

// QRModal.tsx — listens
window.addEventListener('openQRModal', () => setOpen(true))
```

This avoids prop drilling or a context provider for a simple one-way trigger.

## Adding a new section

1. Create `components/MySection.tsx`
2. If it needs WP data: add a fetch function to `lib/wordpress.ts`, add the type to `types/wordpress.ts`
3. Import and add to `app/page.tsx` (server component for data-fetching sections, direct render for static)
4. Add CSS to `globals.css` following existing naming (`my-section`, `ms-*`, etc.)
5. Add a `<div className="rule" />` before the section in `page.tsx`
6. Add a nav link in both `Nav.tsx` and the mobile menu

## Changing WP data sources

All WP API configuration is in `lib/wordpress.ts` and `.env.local`. The endpoints consumed are:

```
WP_API_URL/portfolio          → Design section
WP_API_URL/posts              → Writing section
WP_API_URL/posts?categories=X → Beyond section (X = WP_BEYOND_CATEGORY slug)
```

To add Research or Talks from WP (instead of static), add fetch functions following the `getDesignPosts` pattern and update `Research.tsx` / `Labs.tsx` to accept props.

## Common mistakes to avoid

- Don't add `'use client'` to data-fetching components — breaks ISR
- Don't hardcode colors — use CSS custom properties from the token system
- Don't remove `stripHtml()` entity decoding — WP titles contain `&#8220;` etc.
- Don't set `revalidate: 0` — kills ISR, every request hits WordPress
- Don't add Tailwind — the design system is already complete in globals.css
- Don't use `next/font` if the build environment has restricted network access
- Don't put WP fetch logic in client components — they run in the browser after hydration

## Environment

```bash
WP_API_URL              # Base WP REST API URL (no trailing slash)
WP_PROJECT_POST_TYPE    # CPT slug for design posts (default: portfolio)
WP_BEYOND_CATEGORY      # Category slug for personal posts (default: beyond)
WP_WRITING_PER_PAGE     # Posts to show in Writing section (default: 8)
```
