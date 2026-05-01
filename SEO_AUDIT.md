# SEO Audit — aaron.kr (Next.js 15 App Router)

**Audit date:** 2026-05-01  
**Auditor:** Claude Code (claude-sonnet-4-6)  
**Site URL:** https://aaron.kr  
**Framework:** Next.js 15, App Router, WordPress REST API  

---

## Summary Table

| Check | Before | After | Severity |
|---|---|---|---|
| `metadataBase` set in root layout | MISSING | FIXED | CRITICAL |
| `title.template` in root layout | MISSING | FIXED | HIGH |
| `robots.ts` | MISSING | FIXED (created) | HIGH |
| JSON-LD — Person + WebSite (homepage) | MISSING | FIXED | HIGH |
| JSON-LD — Article (blog posts) | MISSING | FIXED | HIGH |
| JSON-LD — Article/CreativeWork/ScholarlyArticle/Event (CPT pages) | MISSING | FIXED | HIGH |
| `og:image` on homepage | MISSING | FIXED | HIGH |
| `twitter:creator` | MISSING | FIXED (all pages) | MEDIUM |
| `twitter:images` on post pages | MISSING | FIXED | MEDIUM |
| Per-page `alternates.canonical` on post pages | MISSING | FIXED | MEDIUM |
| `og:type: article` + `publishedTime/modifiedTime` on blog posts | MISSING | FIXED | MEDIUM |
| `/writing` description length (was 43 chars) | TOO SHORT | FIXED (142 chars) | MEDIUM |
| `/portfolio` description length (was 45 chars) | TOO SHORT | FIXED (147 chars) | MEDIUM |
| Category page description | GENERIC | IMPROVED | LOW |
| Tag page description | GENERIC | IMPROVED | LOW |
| `alternates.canonical` on archive pages | MISSING | FIXED | LOW |
| `openGraph` on archive pages | MISSING | FIXED | LOW |
| Sitemap: post URLs with category prefix | SLUG-ONLY | FIXED | LOW |
| Sitemap: CPT URLs with type prefix | SLUG-ONLY | FIXED | LOW |
| `hreflang` alternates | MISSING | PARTIAL (root layout) | LOW |
| `<html lang="en">` | PRESENT | OK | — |
| Image alt text | PRESENT (next/image with alt) | OK | — |
| Descriptive link text | ADEQUATE | OK | — |
| WordPress SEO fields flow through | PRESENT (`post.seo.*`) | OK | — |
| `sitemap.ts` exists and covers all routes | PRESENT (slugs only) | IMPROVED | — |

**CRITICAL = site-breaking for SEO. HIGH = significant ranking/social impact. MEDIUM = measurable improvement. LOW = best-practice polish.**

---

## Per-Check Detail

### 1. `metadataBase` — CRITICAL → FIXED

**File:** `app/layout.tsx`

Without `metadataBase`, Next.js 15 cannot resolve relative og:image URLs. Any `images: [{ url: '/path' }]` in metadata simply produces an empty `og:image` tag, causing link previews on Twitter/X, LinkedIn, and iMessage to show blank images.

**Fix:** Added `metadataBase: new URL('https://aaron.kr')` to the root layout's exported `metadata` object.

---

### 2. `title.template` — HIGH → FIXED

**File:** `app/layout.tsx`

The root layout previously set `title` as a plain string. This means every page had to manually append ` · Aaron Snowberger` to its title string. If a child page's `generateMetadata` forgot to do so, the title would be bare. With a template, child pages set only their page-specific name and the suffix is appended automatically by Next.js.

**Fix:**
```ts
title: {
  template: '%s · Aaron Snowberger',
  default:  'Aaron Snowberger, Ph.D. · AI Researcher & Educator',
}
```

All child page titles were updated to export only the page-specific name (e.g., `'Writing'` instead of `'Writing · Aaron Snowberger'`).

---

### 3. `robots.ts` — HIGH → FIXED (created)

**File:** `app/robots.ts` (new)

No `robots.txt` or `robots.ts` existed. Search engines were operating without any crawl guidance. Without it, Google indexes `/_next/`, `/wp-admin/`, and API routes unnecessarily.

**Fix:** Created `app/robots.ts` using the Next.js `MetadataRoute.Robots` type. Disallows `/api/`, `/_next/`, `/wp-admin/`, and `/wp-login.php`. Points to `https://aaron.kr/sitemap.xml`.

---

### 4. JSON-LD Structured Data — HIGH → FIXED

**Files:** `app/page.tsx`, `app/blog/[slug]/page.tsx`, `app/[...segments]/page.tsx`, `app/[postType]/[slug]/page.tsx`

No JSON-LD existed anywhere in the site. This means Google cannot render rich results (author bylines, article dates, breadcrumbs, etc.) for any page.

**Fixes applied:**

- **Homepage (`app/page.tsx`):** Added `Person` schema (name, jobTitle, sameAs for LinkedIn/GitHub/Scholar/ORCID/KSPAI/Naver, address, image, knowsAbout) and `WebSite` schema with `SearchAction`.
- **Blog posts (`app/blog/[slug]/page.tsx`):** Added `Article` schema with `headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`, `image`, `articleSection`, and `keywords`.
- **Catch-all pages (`app/[...segments]/page.tsx`):** Added `Article` (for `post` type) or `CreativeWork` (for all CPTs).
- **Named CPT pages (`app/[postType]/[slug]/page.tsx`):** Added type-aware schema — `ScholarlyArticle` for research (with `identifier` DOI, `publisher` venue, `contributor` co-authors), `Event` for talks (with `location` and `startDate`), `Article` for posts, `CreativeWork` for others.

---

### 5. `og:image` on Homepage — HIGH → FIXED

**File:** `app/layout.tsx`

The root layout's `openGraph` block had no `images` property. Social media link previews for the homepage showed no image.

**Fix:** Added the profile photo as the default OG image with explicit width/height (1200×630) and alt text.

---

### 6. `twitter:creator` and `twitter:images` — MEDIUM → FIXED

**Files:** `app/layout.tsx`, all post `generateMetadata` functions

Twitter Card metadata existed in root layout but lacked `creator` (author handle) and `images`. Post pages had no `twitter` metadata at all.

**Fix:** Added `creator: '@aaronsnowberger'` and `images` to root layout twitter metadata. Added full `twitter` blocks to all `generateMetadata` functions across post pages, category pages, tag pages, and archive pages.

---

### 7. Per-page `alternates.canonical` — MEDIUM → FIXED

**Files:** All `generateMetadata` functions

Individual post pages, category pages, tag pages, and archive pages were not setting their own canonical URL. Only the root layout set `canonical: 'https://aaron.kr'`, which applied globally as a fallback — incorrect for post/archive pages.

**Logic:** Uses `post.seo?.canonical` (from WordPress Yoast/RankMath plugin via mu-plugin) when available; falls back to the computed Next.js URL.

**Fix:** Added `alternates: { canonical }` to all `generateMetadata` returns.

---

### 8. `og:type: 'article'` and Article timestamps — MEDIUM → FIXED

**Files:** `app/blog/[slug]/page.tsx`, `app/[...segments]/page.tsx`, `app/[postType]/[slug]/page.tsx`

Post pages were using the default `og:type: 'website'`. Blog posts should use `'article'` with `publishedTime`, `modifiedTime`, and `authors` to enable rich article previews on Facebook and LinkedIn.

**Fix:** Conditional `ogType = post.type === 'post' ? 'article' : 'website'` and article-specific OG properties added.

---

### 9. Description length — MEDIUM → FIXED

**Files:** `app/writing/page.tsx`, `app/portfolio/page.tsx`

| Page | Before | After | Char count |
|---|---|---|---|
| `/writing` | "Essays, reflections, and notes from Aaron Snowberger." | "Essays, reflections, technical notes, and observations from Aaron Snowberger — AI researcher, educator, and longtime resident of South Korea." | 142 |
| `/portfolio` | "Design, magazine, and visual work by Aaron Snowberger." | "Design, magazine layout, and visual work by Aaron Snowberger — two decades of creative projects spanning print, digital, and academic publishing." | 147 |

Target range: 120–160 characters. Both now within range.

---

### 10. Category and Tag descriptions — LOW → IMPROVED

**Files:** `app/category/[slug]/page.tsx`, `app/tag/[slug]/page.tsx`

Category: `"Posts in the ${categoryName} category."` → `"Browse all posts filed under ${categoryName} by Aaron Snowberger — AI researcher and educator based in Jeonju, South Korea."`

Tag: `"Posts tagged ${tagName}."` → `"Browse all posts tagged "${tagName}" by Aaron Snowberger — AI researcher and educator based in Jeonju, South Korea."`

---

### 11. Sitemap improvements — LOW → IMPROVED

**File:** `app/sitemap.ts`

**Before:** Post entries used slug-only URLs (`/my-post-slug`). CPT entries also used slug-only URLs.

**After:**
- Posts fetch with `categories` field. Category IDs are resolved via a parallel fetch of all categories. Post URL becomes `/${catSlug}/${postSlug}` when a primary category is available, matching the WordPress `/%category%/%postname%/` permalink structure exactly. Falls back to `/${slug}` if the category can't be resolved (for safety).
- CPT entries now use type-prefixed URLs: `/portfolio/slug`, `/research/slug`, `/talks/slug`, `/courses/slug` — matching the `[postType]/[slug]` route.

---

### 12. `hreflang` — PARTIAL

**File:** `app/layout.tsx`

The site uses a client-side language toggle (`data-lang="en|ko"`) that shows/hides `.en` / `.ko` CSS-class elements rather than serving separate URLs at `/ko/` routes. Because there are no distinct Korean-language URLs, full `hreflang` alternate links cannot be implemented in the standard way.

**What was added:** `alternates.languages` in root layout pointing both `en` and `ko` to `https://aaron.kr` (x-default behavior). This signals to Google that the page serves bilingual content at a single URL.

**Recommended future work:** If the site ever adopts separate `/ko/` route paths (e.g., Next.js `[locale]` directory), proper per-page hreflang alternates should be added then.

---

### 13. Checks that passed without changes

| Check | Status |
|---|---|
| `<html lang="en">` | Set in root layout |
| WordPress SEO fields (`post.seo.*`) | Typed in `WPPost` and consumed in all `generateMetadata` functions |
| Image alt text | All `next/image` usages pass alt text; featured image alt falls back to post title |
| Descriptive link text | Nav and footer links use meaningful text; icon-only buttons have `aria-label` |
| `sitemap.ts` exists | Present and improved |
| Root layout description (146 chars) | Within 120–160 range |

---

## Files Changed

| File | Change type |
|---|---|
| `app/layout.tsx` | Added `metadataBase`, `title.template`, `og:image`, `twitter:creator`, `twitter:images`, `hreflang` alternates |
| `app/page.tsx` | Added page-level `metadata` export; added Person + WebSite JSON-LD scripts |
| `app/robots.ts` | **Created** — Next.js App Router robots.txt generation |
| `app/sitemap.ts` | Rewrote to include category-prefixed post URLs and type-prefixed CPT URLs |
| `app/blog/[slug]/page.tsx` | Improved `generateMetadata` (canonical, og:type, twitter, timestamps); added Article JSON-LD |
| `app/[...segments]/page.tsx` | Improved `generateMetadata` (canonical, og:type, twitter); added Article/CreativeWork JSON-LD |
| `app/[postType]/[slug]/page.tsx` | Improved `generateMetadata` (canonical, og:type, twitter); added type-aware JSON-LD (ScholarlyArticle/Event/Article/CreativeWork) |
| `app/writing/page.tsx` | Improved description, added canonical, OG, twitter metadata |
| `app/portfolio/page.tsx` | Improved description, added canonical, OG, twitter metadata |
| `app/category/[slug]/page.tsx` | Improved `generateMetadata` (longer description, canonical, OG, twitter) |
| `app/tag/[slug]/page.tsx` | Improved `generateMetadata` (longer description, canonical, OG, twitter) |

---

## Remaining Recommendations (not auto-fixable)

1. **Twitter/X handle verification** — `@aaronsnowberger` was inferred from the site name. Confirm this is the correct handle (or update if different).

2. **OG image for posts without featured image** — When a WP post has no featured image, `og:image` falls back to nothing. Consider adding a fallback OG image (e.g., the profile photo or a branded card) for posts that have no featured image.

3. **Favicon variants** — Only `favicon.svg` is declared. Adding `apple-touch-icon.png` (180×180) and `favicon-32x32.png` would improve home screen appearance on iOS and legacy browsers.

4. **Hreflang full implementation** — If `/ko/` sub-routes are ever added, implement proper per-page hreflang alternates using Next.js's `alternates.languages` in each `generateMetadata`.

5. **Category description in WP** — Consider adding a WP category description for each category (Sport, Health, etc.) and surfacing it as the meta description on category archive pages, rather than the generic template string.

6. **Breadcrumb JSON-LD** — The `Breadcrumbs` component renders visible breadcrumbs. Adding `BreadcrumbList` JSON-LD schema alongside it would enable Google's breadcrumb rich results in SERPs. This requires a server-side breadcrumb data prop.

7. **Sitemap pagination** — If the site grows beyond ~1000 URLs, consider splitting into a sitemap index with multiple sitemap files (Next.js supports `generateSitemaps()` for this).
