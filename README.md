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
| Styling | Global CSS (no Tailwind, no CSS modules) — v7 design system |
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
  layout.tsx          Root layout: anti-flash script, Google Fonts link, metadata
  page.tsx            Home page (server component) — fetches WP data in parallel
  globals.css         Complete v7 design system
  [...segments]/
    page.tsx          Catch-all route — handles /%category%/%postname%/ and CPT slugs

components/
  Nav.tsx             Fixed nav with theme/lang/aurora toggles + mobile menu (client)
  Hero.tsx            Hero section — static server component
  WyoKoreaSlider.tsx  Wyoming/Korea comparison slider (client)
  Research.tsx        Research section — static, links to pailab.io
  Teaching.tsx        Teaching section — static, links to courses.aaron.kr
  Labs.tsx            Labs section — static, links to pailab.io
  Design.tsx          Design grid — WP portfolio posts + static fallback
  Writing.tsx         Blog post list — WP posts + static fallback
  Beyond.tsx          Personal interests grid — WP posts + static fallback
  Footer.tsx          3-column footer with Wyoming logo (server)
  QRModal.tsx         QR code modal with tabs + .vcf download (client)
  ClientInit.tsx      Scroll progress bar + IntersectionObserver for .rise (client)

lib/
  wordpress.ts        WP REST API helpers with ISR fetch, entity decoding, utilities

types/
  wordpress.ts        WPPost type with all custom fields from the mu-plugin
```

---

## WordPress data flow

`app/page.tsx` is a **server component** that runs three WP fetches in parallel at build/ISR time:

```typescript
const [designPosts, writingPosts, beyondPosts] = await Promise.all([
  getDesignPosts(4),     // /wp-json/wp/v2/portfolio
  getWritingPosts(),     // /wp-json/wp/v2/posts
  getBeyondPosts(6),     // /wp-json/wp/v2/posts?categories=beyond
])
```

Each function returns `[]` on network failure, so the page always renders using the static fallback data in each component. The site works in local development before WordPress is configured.

**ISR revalidation:** `next: { revalidate: 3600 }` on all fetches. Pages rebuild at most once per hour. Trigger an immediate rebuild from the Vercel dashboard for urgent publishes.

---

## URL routing

WordPress permalink structure is `/%category%/%postname%/`. The catch-all route `app/[...segments]/page.tsx` handles all post URLs:

- `/design/my-project` → finds portfolio post by slug `my-project`
- `/teaching/lecture-notes` → finds post by slug `lecture-notes`
- `/portfolio/my-item` → first segment `portfolio` hints at CPT, tries that first
- `/research/paper-title` → same CPT hint logic

The last URL segment is always the WP slug. Category/type prefix is used as a hint only — WP slugs are unique site-wide so the lookup is reliable.

---

## Custom WP REST fields consumed

All provided by the mu-plugin in `aaron-kr-wp`:

| Field | Used in |
|---|---|
| `featured_image_urls.large` | Design, Beyond, catch-all pages |
| `excerpt_plain` | Writing, Beyond |
| `reading_time_minutes` | Post pages |
| `category_list` | Post pages |
| `tag_list` | Post pages, Design |
| `seo.description` | generateMetadata on all post pages |
| `seo.og_image` | generateMetadata on all post pages |
| `research_meta` | Research post pages |
| `talk_meta` | Talk post pages |

---

## Getting started

```bash
# Install
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local — uncomment the local WP_API_URL line

# Copy your images to public/img/
# Required: wyoming-tetons-oxbow-bend.jpg, korea-jeonju-hanok-village.jpg,
#           hangul-calligraphy.jpg, hangul-papers.jpg,
#           wyoming_cowboys_no-txt.webp, plus Beyond section photos

# Run dev server
npm run dev
# → http://localhost:3000

# Build check
npm run build
```

---

## Environment variables

```bash
# .env.local

# ONE of these at a time:
WP_API_URL=http://aaronkr.local/wp-json/wp/v2        # local dev
# WP_API_URL=https://notes.aaron.kr/wp-json/wp/v2    # production

WP_PROJECT_POST_TYPE=portfolio   # CPT slug for design posts
WP_BEYOND_CATEGORY=beyond        # Category slug for personal posts
WP_WRITING_PER_PAGE=8
```

Set the production values in **Vercel → Project → Settings → Environment Variables**.

---

## Deployment

```bash
npm install -g vercel
vercel          # first deploy
vercel --prod   # subsequent deploys
```

Or connect the GitHub repo to Vercel for automatic deploys on push to `main`.

---

## Images

Local images go in `public/img/` and are referenced in `globals.css` background properties and component `<img>` tags. `next/image` is used only for the hero photo (the one external image that benefits from optimization).

Remote domains allowed in `next.config.ts`:
- `notes.aaron.kr` — WordPress uploads (admin screenshots, etc.)
- `files.aaron.kr` — main media library (all uploaded content lives here)
- `i0.wp.com` — Jetpack CDN variants of files.aaron.kr images
- `aaron.kr` — legacy references from before the subdomain migration
- `aaronkr-courses.github.io` — university logos used in Teaching section
- `aaronsnowberger.com` — client logos used in Design section

---

## Bilingual content

Toggle: `한국어 / English` button in nav. State in `localStorage` (`as_lang`) → `data-lang` on `<html>`.

```tsx
<span className="en">English text</span>
<span className="ko">한국어 텍스트</span>
```

---

## External links by section

| Section | Links to |
|---|---|
| Research | pailab.io |
| Teaching | courses.aaron.kr |
| Labs | pailab.io |
| Design (View all) | aaron.kr/portfolio |
| Writing (All posts) | aaron.kr |
| Nav Courses | courses.aaron.kr |
