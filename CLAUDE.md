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
app/writing/page.tsx      Blog post archive — all published posts
app/portfolio/page.tsx    Portfolio archive
app/category/[slug]/      Category archive with full category list
app/tag/[slug]/           Tag archive with full tag cloud
app/[...segments]/
  page.tsx                Catch-all: handles /%category%/%postname%/ and CPT URLs

components/
  ClientInit.tsx          useEffect only: scroll progress + IntersectionObserver
  Nav.tsx                 'use client' — theme/lang/aurora toggles, mobile menu, Beyond dropdown (click-toggle)
  Hero.tsx                Static — no props
  WyoKoreaSlider.tsx      'use client' — range input → clipPath
  Research.tsx            Static — links to pailab.io
  Teaching.tsx            Static — links to courses.aaron.kr
  Labs.tsx                Static — links to pailab.io
  Design.tsx              Props: WPPost[] — WP portfolio + static fallback. Export: DESIGN_COUNT
  Writing.tsx             Props: WPPost[] — WP posts + static fallback. Export: WRITING_COUNT
  Beyond.tsx              Props: WPCategory[] + WPCategory[] (all) — image grid + tag list. Export: FEATURED_SLUGS
  PostLayout.tsx          Shared server component for all single-post pages
  PostSidebar.tsx         Sticky sidebar: author card + related posts (blog posts only)
  PostFooter.tsx          Full-width prev/next + related posts section
  PostLightbox.tsx        'use client' — click-to-enlarge images in .wp-content
  ShareButtons.tsx        'use client' — native share / X / LinkedIn / copy link
  GiscusComments.tsx      'use client' — Giscus (GitHub Discussions) comments embed
  Breadcrumbs.tsx         Server component — breadcrumb trail for post/archive pages
  Footer.tsx              Static server component
  QRModal.tsx             'use client' — opens via window event 'openQRModal'

lib/wordpress.ts          fetch wrappers, ISR, stripHtml with entity decode, helpers
types/wordpress.ts        WPPost, WPCategory, WPTag interfaces with all mu-plugin custom fields
```

## Configurable constants (edit in component, not env vars)

| Constant | File | Effect |
|---|---|---|
| `DESIGN_COUNT` | `Design.tsx` | Number of portfolio posts on homepage |
| `WRITING_COUNT` | `Writing.tsx` | Number of blog posts on homepage |
| `FEATURED_SLUGS` | `Beyond.tsx` | Which category slugs get image cards |
| `BEYOND_ITEMS` | `Nav.tsx` | Category links in the nav dropdown (keep in sync with FEATURED_SLUGS) |

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
// Homepage (app/page.tsx)
getDesignPosts(DESIGN_COUNT)   → /wp-json/wp/v2/portfolio
getWritingPosts(WRITING_COUNT) → /wp-json/wp/v2/posts
getBeyondCategories(6)         → children of "beyond" parent category
getAllBlogCategories()          → all categories (for tag buttons in Beyond + category archive)

// Archives
getPortfolioPosts()            → /wp-json/wp/v2/portfolio
getPostsByCategory(slug)       → /wp-json/wp/v2/posts?categories=ID
getPostsByTag(slug)            → /wp-json/wp/v2/posts?tags=ID
getAllTags()                    → /wp-json/wp/v2/tags

// Single posts
getPostBySlug(slug, type)      → tries each CPT endpoint in order
getRelatedPosts(...)           → same category, excludes current
getAdjacentPosts(...)          → prev/next by date
```

## Custom post types and REST slugs

```
portfolio    → /wp-json/wp/v2/portfolio      (taxonomy: portfolio_type)
testimonial  → /wp-json/wp/v2/testimonials
research     → /wp-json/wp/v2/research       (taxonomy: research_area)
talk         → /wp-json/wp/v2/talks
course       → /wp-json/wp/v2/courses
```

Standard `post` and `page` are also extended with all custom fields.

## Custom REST fields consumed

| Field | Type | Notes |
|---|---|---|
| `reading_time_minutes` | integer | 200wpm calculation |
| `excerpt_plain` | string | HTML-stripped, 160 char max |
| `featured_image_urls` | object | `{full, large, medium_large, medium, alt}` — prefers large→medium_large→medium→full |
| `author_card` | object | `{name, slug, description, url, avatar}` — avatar prefers custom URL set in WP admin |
| `category_list` | array | `[{id, name, slug}]` |
| `tag_list` | array | `[{id, name, slug}]` |
| `acf` | object | All ACF fields (if ACF plugin active) |
| `seo` | object | `{title, description, canonical, no_index, og_image}` from Yoast |
| `research_meta` | object | venue, year, doi, pdf_url, award, coauthors |
| `talk_meta` | object | event, event_date, location, slides_url, video_url, language |
| `testimonial_meta` | object | person_name, person_title, person_org, rating, language, context |
| `portfolio_meta` | object | client, year, tools, project_url |
| `naver_blog_url` | string | Naver Blog cross-post URL |
| `korean_post_url` | string | Any other Korean cross-post URL |

## PostLayout props

```typescript
<PostLayout
  post={post}
  related={related}
  prev={prev}
  next={next}
  showShare={true}       // default: true for all types
  showComments={false}   // default: true for 'post', false for CPTs
                         // pass showComments={true} to enable on a CPT page
/>
```

## Giscus comments setup

Set in `.env.local` AND Vercel environment variables:
```bash
NEXT_PUBLIC_GISCUS_REPO=username/repo           # GitHub repo with Discussions enabled
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxxxxxxx         # from giscus.app
NEXT_PUBLIC_GISCUS_CATEGORY=Comments            # Discussion category name
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxxxxxxx   # from giscus.app
```
GiscusComments renders nothing if env vars are not set. Theme syncs automatically with dark/light toggle.

## CSS design system

**Tokens:** All colors via CSS custom properties. Never hardcode colors.
**Fill-slide hover:** `.fs` (full fill, text → `--bg`) `.fss` (soft fill). Set `--sf` for fill color. Pre-built: `.sl-t` (teal), `.sl-b` (blue), `.sl-p` (purple), `.sl-pk` (pink).
**Rise animation:** `.rise` + `ClientInit.tsx` IntersectionObserver adds `.in`.
**Section labels:** `.sec-lbl` + `.bl` `.pu` `.pk` modifiers.
**Section title links:** `.sec-h2-link` — no underline, color inherit, opacity on hover.
**Breadcrumbs:** `.breadcrumbs`, `.bc-item`, `.bc-sep`, `.bc-link`, `.bc-cur`.
**Share bar:** `.share-bar`, `.share-btn`, `.share-lbl`, `.share-feedback`.
**Comments:** `.comments-wrap`, `.giscus-outer`, `.giscus-lbl`.

## Nav dropdown

The "Beyond" dropdown in `Nav.tsx` is a **click-toggle** (not CSS hover) managed by `beyondOpen` state. Closes on outside click via `document.addEventListener`. `BEYOND_ITEMS` at the top of `Nav.tsx` defines the dropdown links — keep these in sync with `FEATURED_SLUGS` in `Beyond.tsx`.

## QR Modal communication

Nav fires `window.dispatchEvent(new Event('openQRModal'))`. QRModal listens via `window.addEventListener`. Custom DOM event — no shared state or context needed.

## Remote image domains (next.config.ts)

- `notes.aaron.kr` — WP uploads
- `files.aaron.kr` — media library
- `i0.wp.com` — Jetpack CDN
- `aaron.kr` — legacy (pre-migration references)
- `aaronkr-courses.github.io` — university logos
- `aaronsnowberger.com` — client logos

## Environment variables

```bash
WP_API_URL              # Base WP REST API URL (http://aaronkr.local or https://notes.aaron.kr/.../v2)
WP_PROJECT_POST_TYPE    # CPT slug for design posts (default: portfolio)
WP_BEYOND_CATEGORY      # Category slug for personal posts (default: beyond)
WP_WRITING_PER_PAGE     # Overrides WRITING_COUNT from env (optional — prefer the component constant)

NEXT_PUBLIC_GISCUS_REPO          # GitHub repo for Giscus comments
NEXT_PUBLIC_GISCUS_REPO_ID       # From giscus.app
NEXT_PUBLIC_GISCUS_CATEGORY      # Discussion category name
NEXT_PUBLIC_GISCUS_CATEGORY_ID   # From giscus.app
```

## Common mistakes to avoid

- Don't reference `aaron.kr/content/` — that path no longer exists
- Don't use `lab.aaron.kr` — WordPress is at `notes.aaron.kr`
- Don't add `'use client'` to data-fetching components — breaks ISR
- Don't hardcode colors — use CSS custom properties
- Don't skip `stripHtml()` — WP titles contain HTML entities
- Don't set `revalidate: 0` — every request would hit WordPress
- Don't add Tailwind — globals.css is the complete design system
- Don't use `next/font` if the build environment has restricted network access
- Don't change `BEYOND_ITEMS` in Nav.tsx without also updating `FEATURED_SLUGS` in Beyond.tsx
