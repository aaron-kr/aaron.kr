# aaron-kr

Next.js frontend for [aaron.kr](https://aaron.kr) — personal site for Aaron Snowberger, Ph.D., AI researcher and educator based in Jeonju, South Korea.

Deployed on Vercel. Content served from headless WordPress at `lab.aaron.kr` via the WP REST API.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Deployment | Vercel (ISR — pages revalidate hourly) |
| CMS | WordPress REST API (`lab.aaron.kr`) |
| Fonts | Google Fonts via `<link>` — Playfair Display, DM Sans, Noto Sans KR |
| Styling | Global CSS (no Tailwind, no CSS modules) — v7 design system |
| QR codes | `react-qr-code` |

---

## Design system

The entire visual language lives in `app/globals.css`. Key concepts:

**Tokens** — CSS custom properties on `[data-theme="dark"]` and `[data-theme="light"]`. Four accent colors: `--teal`, `--blue`, `--purple`, `--pink` (northern lights palette).

**Fill-slide system** — `.fs` / `.fss` classes give elements a left-to-right color fill on hover using a `::before` pseudo-element with `transform: translateX`. No JS involved.

**Bilingual** — `[data-lang="en"] .ko { display:none }` and vice versa. Every text node that has a Korean translation uses `<span class="en">` / `<span class="ko">` siblings.

**Aurora** — `[data-aurora="on"]` enables radial gradient overlays on `#hero` and `#research`. Toggled by the ✦ button in the nav.

**Theme persistence** — Anti-flash script in `app/layout.tsx` reads `localStorage` and sets `data-theme`, `data-lang`, `data-aurora` on `<html>` before first paint. Keys: `as_theme`, `as_lang`, `as_aurora`.

---

## Project structure

```
app/
  layout.tsx          Root layout: anti-flash script, Google Fonts link, metadata
  page.tsx            Home page (server component) — fetches WP data in parallel
  globals.css         Complete v7 design system

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

Each function in `lib/wordpress.ts` returns `[]` on network failure, so the page always renders using the static fallback data built into each component. This means the site works perfectly in local development even before WordPress is configured.

**ISR revalidation:** `next: { revalidate: 3600 }` on all fetches. Pages rebuild at most once per hour. Trigger an immediate rebuild from the Vercel dashboard if you publish something urgent.

---

## Custom WP REST fields used

All consumed from the mu-plugin in `aaron-kr-wp`:

| Field | Used in |
|---|---|
| `featured_image_urls.large` | Design, Beyond |
| `excerpt_plain` | Writing, Beyond |
| `reading_time_minutes` | Writing (future) |
| `category_list` | Writing (future) |
| `tag_list` | Design (future) |

---

## Getting started

```bash
# Install
npm install

# Copy environment template
cp .env.local.example .env.local
# Edit .env.local — set WP_API_URL

# Copy your images to public/img/
# (wyoming-tetons-oxbow-bend.jpg, korea-jeonju-hanok-village.jpg,
#  hangul-calligraphy.jpg, hangul-papers.jpg, wyoming_cowboys_no-txt.webp,
#  plus Beyond section photos)

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

# Local WordPress (LocalWP)
WP_API_URL=http://aaronkr.local/wp-json/wp/v2

# Production (Dreamhost VPS) — use in Vercel dashboard
# WP_API_URL=https://lab.aaron.kr/wp-json/wp/v2

WP_PROJECT_POST_TYPE=portfolio   # CPT slug for design work
WP_BEYOND_CATEGORY=beyond        # Category slug for personal posts
WP_WRITING_PER_PAGE=8
```

Set production values in **Vercel → Project → Settings → Environment Variables**.

---

## Deployment

```bash
npm install -g vercel
vercel          # first deploy — follow prompts
vercel --prod   # subsequent deploys
```

Or connect the GitHub repo to Vercel for automatic deploys on push to `main`.

---

## Images

Place images in `public/img/`. They're referenced in CSS (`globals.css`) and some components use `<img>` tags directly for external images. `next/image` is used for the hero photo only (the one external image that benefits from optimization).

Remote image domains allowed in `next.config.ts`: `aaron.kr`, `files.aaron.kr`, `i0.wp.com`, `lab.aaron.kr`, `aaronkr-courses.github.io`, `aaronsnowberger.com`.

---

## Bilingual content

Language is toggled by the `한국어 / English` button in the nav. State lives in `localStorage` (`as_lang`) and is applied to `data-lang` on `<html>` by both the anti-flash script (before paint) and the Nav component (on toggle).

Pattern for bilingual text:
```tsx
<span className="en">English text</span>
<span className="ko">한국어 텍스트</span>
```

CSS hides the inactive language:
```css
[data-lang="en"] .ko { display: none !important; }
[data-lang="ko"] .en { display: none !important; }
```

---

## External site links

| Section | Links to |
|---|---|
| Research | pailab.io |
| Teaching | courses.aaron.kr |
| Labs | pailab.io |
| Design (View all) | aaron.kr/content/project-type/design |
| Writing (All posts) | aaron.kr/content |
| Nav Courses | courses.aaron.kr |
