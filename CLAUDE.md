# CLAUDE.md — aaron-kr (Next.js frontend)

This file gives Claude context about this repository. Read it before making any changes.

## What this is

Next.js 15 personal site for Aaron Snowberger, Ph.D. Live at [aaron.kr](https://aaron.kr). Single-page homepage with scroll sections. Content for Design, Writing, and Beyond sections fetched from headless WordPress at `notes.aaron.kr`. Research, Teaching, and Labs sections are static. Deployed to Vercel with ISR, auto-deploys on push to `main`.

## WordPress backend

**URL:** `https://notes.aaron.kr`
**REST API base:** `https://notes.aaron.kr/wp-json/wp/v2`
**Media files:** `https://files.aaron.kr/media/`
**WP Admin:** `https://notes.aaron.kr/wp-admin`
**WP repo:** `aaron-kr-wp` — mu-plugin registers CPTs and REST fields this app consumes.

## Deployment

**Branch:** `main` is the production branch. Push to `main` → Vercel auto-deploys in ~90 seconds.
**Vercel project settings:** Framework = Next.js, Production Branch = main, Root = repo root. Do not change these.
**Env vars:** `.env.local` is gitignored. Vercel manages its own env vars. You never change `.env.local` when deploying — local always points to `aaronkr.local`, Vercel always uses `notes.aaron.kr`.

## Architecture rules to preserve

**Server components for data fetching.** `app/page.tsx` is a server component. It fetches from WordPress in parallel and passes data as props to section components. Do not move WP fetches into client components — that breaks ISR and exposes the API URL to the browser.

**Global CSS only — no Tailwind, no CSS modules.** The entire design system is in `app/globals.css`. It uses CSS custom properties extensively. Do not introduce Tailwind classes or inline styles that replicate what the CSS already does.

**`suppressHydrationWarning` on both `<html>` and `<body>`.** The anti-flash script mutates `data-theme`/`data-lang`/`data-aurora` on `<html>` before React hydrates. Browser extensions inject attributes on `<body>`. Both are intentional.

**`<link>` tags for fonts, not `next/font`.** `next/font` requires network access to Google Fonts at build time. CSS vars `--font-playfair`, `--font-dm`, `--font-kr` are set in a `<style>` block in `layout.tsx`.

**Static fallback data in every WP-powered component.** `Design.tsx`, `Writing.tsx`, and `Beyond.tsx` each have a `FALLBACK_*` constant that renders when `posts.length === 0`. Never remove them.

**ISR at 1 hour.** `next: { revalidate: 3600 }` on all WP fetches.

## File map

```
app/layout.tsx              Anti-flash script, font links, metadata, suppressHydrationWarning
app/page.tsx                Server component: parallel WP fetches, section assembly
app/globals.css             ENTIRE design system + all Gutenberg block styles
app/writing/page.tsx        Blog post archive
app/portfolio/page.tsx      Portfolio archive
app/category/[slug]/        Category archive + full category list below posts
app/tag/[slug]/             Tag archive + full tag cloud below posts
app/[postType]/[slug]/      Typed CPT route with generateStaticParams (portfolio, research, talks, etc.)
  page.tsx
app/[...segments]/          Catch-all: handles /%category%/%postname%/ blog URLs + fallback CPT lookup
  page.tsx

components/
  ClientInit.tsx          useEffect: scroll progress + IntersectionObserver + highlight.js init
  Nav.tsx                 'use client' — theme/lang/aurora toggles, mobile menu, Beyond dropdown (click-toggle)
  Hero.tsx                Static — no props
  WyoKoreaSlider.tsx      'use client' — range input → clipPath
  Research.tsx            Static — links to pailab.io
  Teaching.tsx            Static — links to courses.aaron.kr
  Labs.tsx                Static — links to pailab.io
  Design.tsx              Props: WPPost[] — WP portfolio + static fallback. Export: DESIGN_COUNT
  Writing.tsx             Props: WPPost[] — WP posts + static fallback. Export: WRITING_COUNT
  Beyond.tsx              Props: WPCategory[] + WPCategory[] (all) — image grid + tag row. Export: FEATURED_SLUGS
  PostLayout.tsx          Shared server component for all single-post pages
  PostSidebar.tsx         Sticky sidebar: author card + related posts (blog posts only)
  PostFooter.tsx          Full-width prev/next + related posts section
  PostLightbox.tsx        'use client' — click-to-enlarge images in .wp-content
  ShareButtons.tsx        'use client' — native share / X / LinkedIn / copy link
  GiscusComments.tsx      'use client' — Giscus comments: theme + language sync, bilingual label
  Breadcrumbs.tsx         Server component — breadcrumb trail for post/archive pages
  Footer.tsx              Static server component
  QRModal.tsx             'use client' — opens via window event 'openQRModal'

lib/wordpress.ts            fetch wrappers, ISR, stripHtml with entity decode, all fetchers
types/wordpress.ts          WPPost, WPCategory, WPTag interfaces with all mu-plugin custom fields
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

**There is no `/content/` subdirectory.** WordPress previously lived at `aaron.kr/content/` but moved to `notes.aaron.kr`. Any reference to `aaron.kr/content/` in the codebase is stale.

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
  showComments={false}   // default: true for post/research/talk, false for all others
                         // pass showComments={true} to opt any CPT in
                         // pass showComments={false} to opt any type out
/>
```

The default set is defined as `COMMENTS_ON_TYPES = new Set(['post', 'research', 'talk'])` in `PostLayout.tsx`. Edit that set to change which post types get comments globally.

## Giscus comments

**Live on:** [github.com/aaron-kr/aaron.kr/discussions](https://github.com/aaron-kr/aaron.kr/discussions)
**Discussion category:** `Comments` — format is **Announcement** (owner opens threads, anyone can reply; prevents public spam threads)
**Mapping:** `pathname` — each post's URL maps to its own Discussion thread, created on first visit.

**Behaviour:**
- Theme syncs with dark/light toggle via `postMessage` to the Giscus iframe
- Language syncs with 한국어/English toggle by reinitialising the widget
- Label uses bilingual `<span class="en">Discussion</span><span class="ko">댓글</span>` pattern
- Renders nothing if env vars are not set — safe to develop without them

**Env vars** (set in Vercel dashboard, also in `.env.local` if testing locally):
```bash
NEXT_PUBLIC_GISCUS_REPO=aaron-kr/aaron.kr
NEXT_PUBLIC_GISCUS_REPO_ID=<from giscus.app>
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=<from giscus.app>
```

## CSS design system

**Tokens:** All colors via CSS custom properties. Never hardcode colors.
**Fill-slide hover:** `.fs` (full fill, text → `--bg`) `.fss` (soft fill). Set `--sf` for fill color. Pre-built: `.sl-t` (teal), `.sl-b` (blue), `.sl-p` (purple), `.sl-pk` (pink).
**Rise animation:** `.rise` + `ClientInit.tsx` IntersectionObserver adds `.in`.
**Section labels:** `.sec-lbl` + `.bl` `.pu` `.pk` modifiers.
**Section title links:** `.sec-h2-link` — no underline, color inherit, opacity on hover.
**Breadcrumbs:** `.breadcrumbs`, `.bc-item`, `.bc-sep`, `.bc-link`, `.bc-cur`.
**Share bar:** `.share-bar`, `.share-btn`, `.share-lbl`, `.share-feedback`.
**Comments:** `.comments-wrap` (max-width 880px container), `.giscus-outer` (direct Giscus wrapper).
**Post layout:** `.post-layout` (no sidebar, max-width 880px) / `.post-layout.has-sidebar` (grid, max-width 1160px). CSS variables `--post-h-pad` and `--post-sidebar-bleed` are set on `.post-layout` and consumed by `.alignwide` / `.alignfull` inside `.wp-content`.

**WordPress post content (`.wp-content`):** `globals.css` has a comprehensive Gutenberg block section covering headings h1–h6 (all Playfair Display), paragraphs, drop cap, font-size utility classes, all alignment classes (`alignleft/right/center/wide/full`), cover, gallery, columns, text-columns, buttons (fill/outline/squared), blockquote (decorative quote mark, cite eyebrow line), pullquote, code/pre, preformatted, verse, audio, video, all embed types (YouTube 16:9 container, Twitter/X centered, WordPress oEmbed card), table (header background, row hover), separators (wide gradient, dots asterism), spacer, group, media-text, details/accordion, latest-posts, file blocks (SVG icon), and the full Gutenberg colour palette class set.

**Alignment breakout:** `.alignwide` breaks out 2rem past each side (removes the `.post-layout` padding). `.alignfull` additionally extends into the sidebar column in sidebar-layout posts using `--post-sidebar-bleed`. Both use `!important` to override any equal-specificity block margin rules.

**Global headings:** h1–h6 all use `var(--font-playfair)` globally. Within `.wp-content`, each heading level has its own scoped font-size, margin, and Playfair family.

## Syntax highlighting (highlight.js)

`ClientInit.tsx` dynamically imports `highlight.js` on mount and calls `highlightAll()`. It also stamps a `data-language` attribute on `.wp-block-code` containers for a CSS language badge.

To activate, install the package and import a theme in `app/layout.tsx`:
```bash
npm install highlight.js
```
```typescript
// app/layout.tsx
import 'highlight.js/styles/github-dark-dimmed.css'
```
Without installation, the dynamic import fails silently and code blocks render with the custom monospace CSS only.

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
WP_API_URL              # http://aaronkr.local (local) — set in .env.local, never committed
                        # https://notes.aaron.kr/wp-json/wp/v2 (prod) — set in Vercel dashboard
WP_PROJECT_POST_TYPE    # portfolio
WP_BEYOND_CATEGORY      # beyond
WP_WRITING_PER_PAGE     # 8

NEXT_PUBLIC_GISCUS_REPO          # aaron-kr/aaron.kr
NEXT_PUBLIC_GISCUS_REPO_ID       # from giscus.app
NEXT_PUBLIC_GISCUS_CATEGORY      # Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID   # from giscus.app
```

## Code quality

**ESLint** — `eslint.config.mjs` (flat config, ESLint v9). Extends `next/core-web-vitals` + `next/typescript`. `@next/next/no-page-custom-font` is disabled — this project uses `<link>` tags intentionally, not `next/font`, so the rule fires as a false positive on every page.

**Stylelint** — `.stylelintrc.json`. Checks `app/globals.css` only. `no-descending-specificity` is disabled — WordPress block CSS legitimately uses patterns that trigger false positives (e.g. `.wp-block-X .element` followed by `.wp-content .element`).

**Pre-commit (Husky + lint-staged)** — runs ESLint `--fix` on `*.{ts,tsx}` and Stylelint `--fix` on `*.css` before every commit. `.husky/pre-commit` runs `npx lint-staged`.

**GitHub Actions CI** — `.github/workflows/lint.yml`. On every push/PR to `main`: TypeScript check → ESLint → Stylelint.

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint over app/ components/ lib/ types/
npm run lint:css      # Stylelint over app/globals.css
npm run lint:all      # Both lint commands
```

**History (April 2026):** Fixed 6 ESLint errors: `<a href="/writing">` → `<Link>` in `Writing.tsx` (×2) and `Design.tsx`; removed unused `wpLinkToPath` import in `PostLayout.tsx`; removed unused `Image` import in `Teaching.tsx`; suppressed false-positive font rule. Fixed 12 duplicate CSS selector pairs in `globals.css`, merged duplicate `:root` blocks, co-located `--sf` fill-slide vars with their component blocks, fixed `.tag` shorthand property override (`border-color` then `border` → `border: 1px solid var(--brd-t)`).

---

## AI-assisted development

Claude Code is configured for this repo via this CLAUDE.md file. When using Claude Code or any AI assistant:

- **Run `npm run lint:all` and `npm run typecheck` before committing** — or rely on the pre-commit hook which runs automatically.
- **CI enforces quality on every push** — TypeScript check → ESLint → Stylelint. AI-generated code passes through all three gates before it can merge.
- **Keep CLAUDE.md current** — when a significant architectural decision is made (new route, new WP CPT, new CSS pattern), update this file so future AI sessions start with correct context rather than re-deriving it from the code.
- **globals.css is intentionally large** — do not split it. When adding new component styles, match the existing naming (kebab-case, section-comment headers `/* ── COMPONENT ── */`). The fill-slide `--sf` variable must be co-located with the component's main selector block, not in a separate section.
- **Server/client component boundary is strict** — see Architecture rules above. AI suggestions that move `fetch()` calls into client components break ISR and should be rejected.
- **WordPress CSS false positives are expected** — `no-descending-specificity` is disabled for a reason. Do not re-enable it and do not restructure WP block CSS to satisfy it.

---

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
- Don't change the Vercel production branch away from `main`
- Don't edit `.env.local` when deploying — Vercel uses its own env vars, `.env.local` is local-only
- Don't add `!important` to arbitrary CSS rules — it is intentionally used only on alignment utility classes (`.alignleft`, `.alignright`, `.aligncenter`, `.alignwide`, `.alignfull`) to override equal-specificity block margin rules
