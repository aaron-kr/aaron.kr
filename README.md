# aaron-kr

Next.js frontend for [aaron.kr](https://aaron.kr) — personal site for Aaron Snowberger, Ph.D., AI researcher and educator based in Jeonju, South Korea.

Deployed on Vercel. Content served from headless WordPress at `notes.aaron.kr` via the WP REST API.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Deployment | Vercel (ISR — pages revalidate hourly) |
| CMS | WordPress REST API (`notes.aaron.kr`) |
| Fonts | Google Fonts via `<link>` — Playfair Display, DM Sans, Noto Sans KR |
| Styling | Global CSS (no Tailwind, no CSS modules) — custom design system |
| Comments | Giscus (GitHub Discussions) — optional, configured via env vars |
| QR codes | `react-qr-code` |

---

## Design system

The entire visual language lives in `app/globals.css`. Key concepts:

**Tokens** — CSS custom properties on `[data-theme="dark"]` and `[data-theme="light"]`. Four accent colors: `--teal`, `--blue`, `--purple`, `--pink` (northern lights palette).

**Fill-slide hover** — `.fs` / `.fss` classes give elements a left-to-right color fill on hover using a `::before` pseudo-element. No JS.

**Bilingual** — `[data-lang="en"] .ko { display:none }` and vice versa. Every text node with a Korean translation uses `<span class="en">` / `<span class="ko">` siblings.

**Aurora** — `[data-aurora="on"]` enables radial gradient overlays on `#hero` and `#research`. Toggled by the ✦ button in the nav.

**Theme persistence** — Anti-flash script in `app/layout.tsx` reads `localStorage` and sets `data-theme`, `data-lang`, `data-aurora` on `<html>` before first paint. Keys: `as_theme`, `as_lang`, `as_aurora`.

---

## Project structure

```
app/
  layout.tsx            Root layout: anti-flash script, Google Fonts link, metadata
  page.tsx              Home page (server component) — fetches WP data in parallel
  globals.css           Complete design system
  writing/page.tsx      Blog post archive
  portfolio/page.tsx    Portfolio archive
  category/[slug]/      Category archive + full category list
  tag/[slug]/           Tag archive + full tag cloud
  [...segments]/
    page.tsx            Catch-all route — handles /%category%/%postname%/ and CPT slugs

components/
  Nav.tsx               Fixed nav: theme/lang/aurora toggles, Beyond dropdown (click), mobile menu
  Hero.tsx              Hero section — static
  WyoKoreaSlider.tsx    Wyoming/Korea comparison slider (client)
  Research.tsx          Research section — static, links to pailab.io
  Teaching.tsx          Teaching section — static, links to courses.aaron.kr
  Labs.tsx              Labs section — static, links to pailab.io
  Design.tsx            Design grid — WP portfolio posts + static fallback (export: DESIGN_COUNT)
  Writing.tsx           Blog post list — WP posts + static fallback (export: WRITING_COUNT)
  Beyond.tsx            Personal interests — WP category cards + tag list (export: FEATURED_SLUGS)
  PostLayout.tsx        Shared layout for all single-post pages
  PostSidebar.tsx       Sticky sidebar: author card + related posts (blog only)
  PostFooter.tsx        Full-width prev/next + related posts
  PostLightbox.tsx      Click-to-enlarge images with caption support (client)
  ShareButtons.tsx      Share bar: native / X / LinkedIn / copy link (client)
  GiscusComments.tsx    GitHub Discussions comments embed (client)
  Breadcrumbs.tsx       Breadcrumb trail for post and archive pages
  Footer.tsx            3-column footer with Wyoming logo
  QRModal.tsx           QR code modal with tabs + .vcf download (client)
  ClientInit.tsx        Scroll progress bar + IntersectionObserver for .rise (client)

lib/
  wordpress.ts          WP REST API helpers with ISR fetch, entity decoding, all fetchers
types/
  wordpress.ts          WPPost, WPCategory, WPTag interfaces
```

---

## Configurable constants

These are defined at the top of their component files — edit there, no env var needed:

| Constant | File | Purpose |
|---|---|---|
| `DESIGN_COUNT` | `Design.tsx` | Portfolio posts shown on homepage |
| `WRITING_COUNT` | `Writing.tsx` | Blog posts shown on homepage |
| `FEATURED_SLUGS` | `Beyond.tsx` | Category slugs shown as image cards |
| `BEYOND_ITEMS` | `Nav.tsx` | Category links in the nav Beyond dropdown |

> Keep `BEYOND_ITEMS` and `FEATURED_SLUGS` in sync — they represent the same 6 categories.

---

## WordPress data flow

`app/page.tsx` fetches four WP data sets in parallel at build/ISR time:

```typescript
const [designPosts, writingPosts, beyondCategories, allCategories] = await Promise.all([
  getDesignPosts(DESIGN_COUNT),    // /wp-json/wp/v2/portfolio
  getWritingPosts(WRITING_COUNT),  // /wp-json/wp/v2/posts
  getBeyondCategories(6),          // child categories of "beyond"
  getAllBlogCategories(),           // all categories (for tag buttons)
])
```

Each function returns `[]` on failure so the page always renders using fallback data.

**ISR:** `next: { revalidate: 3600 }` on all fetches. Trigger an immediate rebuild from Vercel for urgent publishes.

---

## URL routing

WordPress permalink structure is `/%category%/%postname%/`. The catch-all route handles all post URLs:

- `/writing/my-post` → blog post by slug `my-post`
- `/portfolio/my-item` → portfolio CPT, tries that first
- `/research/paper-title` → research CPT hint
- `/category/music` → category archive for "music"
- `/tag/korea` → tag archive for "korea"

---

## Post page features

All post types render via `PostLayout` which accepts:

```typescript
showShare?:    boolean  // default true — share bar below tags
showComments?: boolean  // default true for 'post', false for CPTs
```

Pass `showComments={true}` on any CPT page route to enable Giscus there.

**Breadcrumbs** appear at the top of every post (Home › Section › Title).

**Share buttons** — native Web Share API on mobile, with X / LinkedIn / copy-link fallback.

**Giscus comments** — GitHub Discussions embed. Requires env vars (see below). Theme syncs with dark/light toggle automatically.

---

## Giscus comments setup

1. Enable Discussions on a GitHub repo (Settings → Features → Discussions)
2. Install the [Giscus GitHub App](https://github.com/apps/giscus)
3. Visit [giscus.app](https://giscus.app) with your repo → copy the IDs
4. Set in `.env.local` and Vercel env vars:

```bash
NEXT_PUBLIC_GISCUS_REPO=username/repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxxxxxxx
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxxxxxxx
```

The comments section renders nothing until these are set — safe to deploy without them.

---

## Getting started

```bash
npm install

# Copy and configure environment
cp .env.local.example .env.local
# Edit .env.local — set WP_API_URL to http://aaronkr.local for local dev

npm run dev     # → http://localhost:3000
npm run build   # production build check
```

---

## Environment variables

```bash
# WordPress API
WP_API_URL=http://aaronkr.local/wp-json/wp/v2        # local dev
# WP_API_URL=https://notes.aaron.kr/wp-json/wp/v2    # production (comment out local)

WP_PROJECT_POST_TYPE=portfolio   # CPT slug for design posts
WP_BEYOND_CATEGORY=beyond        # Parent category slug for personal interests

# Giscus (optional — comments hidden if unset)
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
```

Set production values in **Vercel → Project → Settings → Environment Variables**.

---

## Deployment

```bash
npm install -g vercel
vercel          # first deploy (prompts for project linking)
vercel --prod   # subsequent deploys
```

Or connect the GitHub repo to Vercel for automatic deploys on push to `main`.

---

## Remote image domains (next.config.ts)

- `notes.aaron.kr` — WordPress uploads
- `files.aaron.kr` — main media library
- `i0.wp.com` — Jetpack CDN
- `aaron.kr` — legacy references
- `aaronkr-courses.github.io` — university logos
- `aaronsnowberger.com` — client logos

---

## Bilingual content

Toggle: `한국어 / English` button in nav. State in `localStorage` (`as_lang`) → `data-lang` on `<html>`.

```tsx
<span className="en">English text</span>
<span className="ko">한국어 텍스트</span>
```
