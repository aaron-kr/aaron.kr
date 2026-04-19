# `aaron-kr`

Next.js frontend for [aaron.kr](https://aaron.kr) — personal site for Aaron Snowberger, Ph.D., AI researcher and educator based in Jeonju, South Korea.

**Live site:** [aaron.kr](https://aaron.kr) — deployed on Vercel, content from headless WordPress at `notes.aaron.kr`.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Deployment | Vercel (ISR — pages revalidate hourly, auto-deploy on push to `main`) |
| CMS | WordPress REST API (`notes.aaron.kr`) |
| Fonts | Google Fonts via `<link>` — Playfair Display, DM Sans, Noto Sans KR |
| Styling | Global CSS (no Tailwind, no CSS modules) — custom design system |
| Comments | Giscus (GitHub Discussions on `aaron-kr/aaron.kr`) |
| Syntax highlighting | highlight.js — optional, install separately (see below) |
| QR codes | `react-qr-code` |

---

## Design system

The entire visual language lives in `app/globals.css`. Key concepts:

**Tokens** — CSS custom properties on `[data-theme="dark"]` and `[data-theme="light"]`. Four accent colors: `--teal`, `--blue`, `--purple`, `--pink` (northern lights palette).

**Fill-slide hover** — `.fs` / `.fss` classes give elements a left-to-right color fill on hover using a `::before` pseudo-element. No JS.

**Bilingual** — `[data-lang="en"] .ko { display:none }` and vice versa. Every text node with a Korean translation uses `<span class="en">` / `<span class="ko">` siblings.

**Aurora** — `[data-aurora="on"]` enables radial gradient overlays on `#hero` and `#research`. Toggled by the ✦ button in the nav.

**Theme persistence** — Anti-flash script in `app/layout.tsx` reads `localStorage` and sets `data-theme`, `data-lang`, `data-aurora` on `<html>` before first paint. Keys: `as_theme`, `as_lang`, `as_aurora`.

**WordPress content** — `.wp-content` in `globals.css` covers all standard Gutenberg block types: headings, paragraphs (drop cap, font-size classes), images (alignleft/right/center/wide/full), cover, gallery, columns, text-columns, buttons, blockquote, pullquote, code, preformatted, verse, audio, video, embeds (YouTube, Twitter/X, WordPress oEmbed), tables, separators, spacer, latest-posts, file blocks, and colour palette classes.

---

## Project structure

```
app/
  layout.tsx              Root layout: anti-flash script, Google Fonts link, metadata
  page.tsx                Home page (server component) — fetches WP data in parallel
  globals.css             Complete design system + all Gutenberg block styles
  writing/page.tsx        Blog post archive
  portfolio/page.tsx      Portfolio archive
  category/[slug]/        Category archive + full category list below posts
  tag/[slug]/             Tag archive + full tag cloud below posts
  [postType]/[slug]/      Typed CPT route — static params at build time
    page.tsx
  [...segments]/          Catch-all — handles /%category%/%postname%/ and fallback CPT slugs
    page.tsx

components/
  Nav.tsx                 Fixed nav: theme/lang/aurora toggles, Beyond dropdown (click-toggle), mobile menu
  Hero.tsx                Hero section — static
  WyoKoreaSlider.tsx      Wyoming/Korea comparison slider (client)
  Research.tsx            Research section — static, links to pailab.io
  Teaching.tsx            Teaching section — static, links to courses.aaron.kr
  Labs.tsx                Labs section — static, links to pailab.io
  Design.tsx              Design grid — WP portfolio posts + static fallback (export: DESIGN_COUNT)
  Writing.tsx             Blog post list — WP posts + static fallback (export: WRITING_COUNT)
  Beyond.tsx              Personal interests — WP category cards + all-categories tag row (export: FEATURED_SLUGS)
  PostLayout.tsx          Shared layout for all single-post pages
  PostSidebar.tsx         Sticky sidebar: author card + related posts (blog only)
  PostFooter.tsx          Full-width prev/next + related posts
  PostLightbox.tsx        Click-to-enlarge images in .wp-content (client)
  ShareButtons.tsx        Share bar: native / X / LinkedIn / copy link (client)
  GiscusComments.tsx      GitHub Discussions comments embed — theme + language sync (client)
  Breadcrumbs.tsx         Breadcrumb trail for post and archive pages (server)
  Footer.tsx              3-column footer with Wyoming logo (server)
  QRModal.tsx             QR code modal with tabs + .vcf download (client)
  ClientInit.tsx          Scroll progress bar + IntersectionObserver + highlight.js init (client)

lib/
  wordpress.ts            WP REST API helpers with ISR fetch, entity decoding, all fetchers
types/
  wordpress.ts            WPPost, WPCategory, WPTag interfaces
```

---

## Configurable constants

Defined at the top of their component files — edit there, no env var needed:

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
  getAllBlogCategories(),           // all categories (for tag buttons + Beyond tag row)
])
```

Each function returns `[]` on failure so the page always renders using fallback data.

**ISR:** `next: { revalidate: 3600 }` on all fetches. Trigger an immediate rebuild from the Vercel dashboard for urgent publishes.

---

## URL routing

WordPress permalink structure is `/%category%/%postname%/`. Two routes handle single posts:

- `app/[postType]/[slug]/page.tsx` — typed route with `generateStaticParams` for CPTs
- `app/[...segments]/page.tsx` — catch-all fallback for `/%category%/%postname%/` blog URLs

Archive routes:
- `/writing` → blog post archive
- `/portfolio` → portfolio archive
- `/category/[slug]` → category archive + full category list
- `/tag/[slug]` → tag archive + full tag cloud

---

## Post page features

All post types render via `PostLayout`:

```typescript
showShare?:    boolean  // default true — share bar below tags
showComments?: boolean  // default: true for post/research/talk, false for others
```

**Comments are on by default** for `post`, `research`, and `talk`. Off for `portfolio`, `testimonial`, `course`, and `page`. Override per-route by passing `showComments` explicitly.

**Breadcrumbs** — Home › Section › Title at the top of every post.

**Share buttons** — native Web Share API on mobile, X / LinkedIn / copy-link fallback on desktop.

**Giscus comments** — GitHub Discussions embed below the post. Theme syncs with dark/light toggle. Language syncs with 한국어/English toggle (widget reinitialises). Renders nothing if env vars are not set.

---

## Giscus comments

Comments are live on [github.com/aaron-kr/aaron.kr/discussions](https://github.com/aaron-kr/aaron.kr/discussions).

The `Comments` discussion category is set to **Announcement** format (only the repo owner can open threads — prevents spam. Readers can still reply to any thread).

Each post's URL path maps automatically to its own Discussion thread on first visit.

To configure in a new environment:

```bash
NEXT_PUBLIC_GISCUS_REPO=aaron-kr/aaron.kr
NEXT_PUBLIC_GISCUS_REPO_ID=          # from giscus.app
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=      # from giscus.app
```

---

## Syntax highlighting (optional)

`ClientInit.tsx` dynamically imports `highlight.js` if it is installed. Install it to activate:

```bash
npm install highlight.js
```

Then import a theme in `app/layout.tsx`:

```typescript
import 'highlight.js/styles/github-dark-dimmed.css'
```

Without this, code blocks render with the custom monospace styling from `globals.css` but without token colours. Gutenberg code blocks use the `language-*` class convention (`<code class="language-javascript">`), which highlight.js picks up automatically.

---

## Getting started

```bash
npm install

cp .env.local.example .env.local
# .env.local already points to http://aaronkr.local — no changes needed for local dev

npm run dev          # → http://localhost:3000
npm run build        # production build (expects aaronkr.local running)
npm run typecheck    # TypeScript check
npm run lint         # ESLint (app/ components/ lib/ types/)
npm run lint:css     # Stylelint (app/globals.css)
npm run lint:all     # ESLint + Stylelint
```

Pre-commit hooks (Husky) run `lint-staged` automatically — ESLint + Stylelint fix on every commit. CI runs TypeScript + ESLint + Stylelint on every push to `main`.

---

## Environment variables

`.env.local` is **gitignored** and never sent to Vercel. Vercel manages its own env vars in the dashboard. You never need to change `.env.local` when deploying.

```bash
# .env.local — local development only
WP_API_URL=http://aaronkr.local/wp-json/wp/v2
WP_PROJECT_POST_TYPE=portfolio
WP_BEYOND_CATEGORY=beyond
WP_WRITING_PER_PAGE=8

NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
```

Production values (set once in **Vercel → Project → Settings → Environment Variables**):

```bash
WP_API_URL=https://notes.aaron.kr/wp-json/wp/v2
WP_PROJECT_POST_TYPE=portfolio
WP_BEYOND_CATEGORY=beyond
WP_WRITING_PER_PAGE=8
NEXT_PUBLIC_GISCUS_REPO=aaron-kr/aaron.kr
NEXT_PUBLIC_GISCUS_REPO_ID=<from giscus.app>
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=<from giscus.app>
```

---

## Deployment

The site auto-deploys on every push to `main`. No deploy commands needed day-to-day.

```bash
# Standard workflow
git add -A
git commit -m "describe the change"
git push          # → Vercel builds and deploys in ~90 seconds
```

**Vercel project settings** (set once, never touch again):
- Framework Preset: **Next.js**
- Production Branch: **main**
- Root Directory: *(empty — repo root)*
- Build / Output / Install: *(all blank — Vercel infers from Next.js preset)*

**ISR content updates:** Publishing a new post in WordPress takes up to 1 hour to appear (ISR revalidation window). For instant updates, go to Vercel → Deployments → Redeploy, or set up a WordPress publish webhook pointing to a Vercel Deploy Hook URL.

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

The Giscus comment widget also switches between English and Korean UI when the language is toggled.
