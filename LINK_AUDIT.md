# Link / Image / Category Audit — 2026-09-04

Full-site crawl of https://aaron.kr (245 pages from sitemap.xml) plus a direct
review of the WordPress REST API and both codebases (`aaron.kr`, `aaron-kr-wp`).
Raw data in `audit-results/*.csv` (gitignored — regenerate any time with
`node tools/audit-urls.mjs`).

## Fixed this session

### 1. Every "View Post" / preview / permalink pointed at `localhost:3000` in production
**Root cause, confirmed live:** production WordPress has `WP_HOME` and
`WP_SITEURL` both set to `https://notes.aaron.kr` (should be
`WP_HOME = https://aaron.kr`). `aaron_kr_frontend_url()` in
`mu-plugins/aaron-kr-api.php` picked the frontend domain by comparing those
two options — when they're equal (as they currently are, in production) it
silently fell back to `http://localhost:3000`. This affected every post's
`link` field, the `seo.canonical` REST field (falls back to `get_permalink()`
when Yoast has no explicit override), and WP admin's Preview/View Post links.

**Measured impact:** the external-link crawl found **239 pages** with a
`<link rel="canonical">` (or similar `href`) pointing at `localhost` — that's
this bug, caught live, affecting real SEO metadata on ~all content pages.

**Fixed:** `mu-plugins/aaron-kr-api.php` and the theme's
`aaron-kr-headless/index.php` now detect environment from the WP siteurl's
own content (`aaronkr.local` / `localhost` substring) instead of comparing
`home` vs `siteurl` — this class of bug can't recur even if wp-config.php
stays misconfigured.

**Still needed from you:** SSH into the Dreamhost VPS and fix wp-config.php so
`WP_HOME` is actually `https://aaron.kr` (see `aaron-kr-wp-config-additions.php`,
now rewritten to auto-detect environment so there's nothing to toggle by hand
next time). The code fix above makes the bug harmless either way, but WP core
itself still uses `home_url()` for feeds/other native features, so the config
should still be corrected properly.

### 2. `/talks/{slug}` 404s (your reported bug)
**Root cause, confirmed live:** there are two unrelated "Talks" — the `talk`
custom post type (rest_base `talks`, ~21 entries) and a legacy WordPress
**category** called "Talks" (id 8, slug `talks`, 27 old blog posts, predates
the CPT). WordPress's post permalink structure is `/%category%/%postname%/`,
so a category-tagged post's real permalink is `/talks/post-slug/` — the exact
same URL prefix as the CPT. `app/[postType]/[slug]/page.tsx` only checked the
CPT's REST endpoint for a `/talks/*` URL, so any of those 27 posts 404'd.
`/category/talks/{slug}` "worked" purely by accident — the catch-all route at
`app/[...segments]/page.tsx` brute-force searches every post type by the last
URL segment regardless of prefix, so it found the post under `posts` even
though `/category/talks/...` isn't WP's real permalink for it either.

**Confirmed:** this crawl found exactly **7 broken pages on the entire site**,
and all 7 are this bug:
```
/talks/experience-the-oregon-trail
/talks/top-ten-rivalries-of-the-american-old-west
/talks/historic-american-old-west
/talks/the-american-old-west
/talks/hamilton-the-musical-based-on-the-man
/talks/marvel-vs-dc-comics
/talks/서울-워드프레스-미트업-2015-...
```
`app/sitemap.ts` was also actively submitting these broken URLs to Google
(it builds post URLs as `/{primaryCategorySlug}/{slug}`).

**Fixed:** `resolvePost()` in `app/[postType]/[slug]/page.tsx` now falls back
to the `posts` endpoint when the CPT lookup misses. No other category slug
collides with a CPT slug (checked the full category list), so this was the
only instance of the pattern.

### 3. Real preview mode (didn't exist before)
Built to solve "I can't preview my scheduled talk." New
`app/api/preview/route.ts` + Next Draft Mode + a WP Application Password.
WP's `aaron_kr_headless_preview_link()` now routes preview links through
`/api/preview?secret=...&id=...` when `AARON_KR_PREVIEW_SECRET` is defined;
the route authenticates back to WordPress to fetch the unpublished post
(public REST API hides drafts/scheduled posts, which is why preview never
really worked before — it wasn't just the localhost bug).

**Setup required before this works (I don't have wp-admin or Vercel access):**
1. wp-admin → Users → Profile → Application Passwords → create one (e.g.
   "aaron.kr preview") for an account that can edit posts.
2. Add to Vercel's environment variables (and your local `.env.local`,
   placeholders already added):
   - `WP_PREVIEW_SECRET` — any long random string
   - `WP_PREVIEW_USER` — the WP username from step 1
   - `WP_PREVIEW_APP_PASSWORD` — the application password from step 1
3. Add `define('AARON_KR_PREVIEW_SECRET', '...');` to wp-config.php with the
   **same** value as `WP_PREVIEW_SECRET` (template in
   `aaron-kr-wp-config-additions.php`).
4. Deploy both repos.

Once set up: click Preview on your scheduled talk in wp-admin → it redirects
through `/api/preview` → enables Draft Mode → renders the real page with an
amber "Preview mode" banner at the top.

**For tomorrow, if setup isn't done in time:** the fastest reliable way to
proof the talk content in its actual rendered design is to temporarily set it
to Published instead of Scheduled — your existing Vercel deploy hook
(`mu-plugins/aaron-kr-api.php`, section 12) fires automatically on publish,
and it'll be live within the hour via ISR.

### 4. Regenerated `public/broken-links.json`
`components/BrokenLinks.tsx` already existed (visually flags known-broken
links inside post content) but was fed from a stale one-time export. Reran
`tools/audit-urls.mjs` against production and regenerated it — **768 unique
broken external links** now flagged (filtered out `localhost` canonical-tag
noise from bug #1 and 2 confirmed false positives — see below). No code
changes needed; this file is already wired into `PostLayout.tsx`.

## Found, not auto-fixed — needs your input

### A. ~595 broken inline images in old portfolio posts (highest-impact remaining item)
Of 858 unique images site-wide, **620 are broken**. The overwhelming majority
— 595 — are `<img>` tags **inside post body content** (not featured images —
those were already checked separately via REST API and are all fine) still
pointing at:
- `www.aaronsnowberger.com/wp-content/uploads/...` (484 images)
- `aaronsnowberger.com/wp-content/uploads/...` (111 images)

almost entirely in the "Jeonbuk Life" magazine portfolio posts
(`/portfolio/jeonbuk-life-v-*`). That domain no longer serves those paths.
Your `mu-plugins/aaron-kr-patcher.php` tool re-hosted **featured** images
during the aaronsnowberger.com → aaron.kr migration but never touched inline
body images — they were left pointing at the old domain, which has since
stopped serving `/wp-content/uploads/`.

Also broken, smaller:
- 18 images from `www.aicfchurch.org` (an old client site, no longer serving them)
- 6 on `files.aaron.kr` itself — genuinely missing media
- 1 literal `http://127.0.0.1/wordpress/...` reference baked into old content
  (`/development/git-wp-cli-windows`)

**Why I didn't auto-fix this:** it's ~595 individual images across dozens of
posts, and safely fixing it means re-hosting each one — which requires
knowing whether the source images still exist anywhere (an
aaronsnowberger.com backup, an old export, Wayback Machine, etc.). This needs
a decision from you: do those images still exist somewhere, and is it worth a
dedicated pass? If so, the approach would mirror `aaron-kr-patcher.php`
(same slug-matching + `media_sideload` pattern) but scoped to rewriting
`<img src>` inside `post_content` instead of the featured image.

### B. `talk`, `research`, and `portfolio` CPTs have no WP `category` support
Their `register_post_type()` calls only attach `post_tag` (+ their own custom
taxonomy) — never `category`. `PostLayout.tsx`'s "Filed under" category
badges are wired up and would work, but `category_list` is always empty for
these types since they were never assigned the taxonomy. Not a bug exactly —
possibly intentional — but worth a decision: if you want talks/research/
portfolio items to show category badges, `mu-plugins/aaron-kr-api.php` would
need `register_taxonomy_for_object_type('category', 'talk')` (etc.) plus a
rewrite flush. Left alone this session since it's a content-model call.

### C. 3 `course` entries have no featured image
IDs 31857, 31855, 31834 ("Computer A+, 2016", "Computer A, 2014",
"Computer A, 2013"). Everything else (portfolio, research, testimonials,
talks) has featured images set.

### D. Stale one-time-use tools still active as mu-plugins
`mu-plugins/aaron-kr-migrate-taxonomies.php`, `aaron-kr-patcher.php`,
`aaron-kr-importer.php`, `aaron-kr-exporter.php` are all one-off migration
tools, each marked "DELETE THIS FILE after running" in their own header
comments, but still present and still registering `admin_menu` pages on every
request. The counts they'd act on (portfolio images/tags) all show 0 missing
via the REST API, suggesting they already did their job. Safe to delete once
you confirm you don't need them again — left in place since deleting files
you might still need is a call I shouldn't make for you.

### E. Broken external links — 768 flagged, treat as candidates not certainties
The crawler does a bare HEAD/GET check with no browser-like headers, so some
sites that block bots will show up as false positives even when fine for
real visitors — I already filtered out two confirmed false positives
(`fonts.googleapis.com`/`fonts.gstatic.com` bare-origin `rel=preconnect`
hints, and your own `m.blog.naver.com/aaron_kr` Footer link, which Naver
timed out on rather than actually being down). `BrokenLinks.tsx` reflects
this by only adding a `title="This link may be broken"` tooltip, never
removing the link — a good design for exactly this uncertainty. Worth a
manual skim of `audit-results/broken-external-links.csv` for anything you
recognize as definitely-fine before trusting the list wholesale; the biggest
non-aaronsnowberger.com clusters were `marketplace.visualstudio.com` (34,
likely a VS Code extension that got delisted), `aaronkr-courses.github.io`
(21), and `github.com` (10).

## Not checked this session
- Content-search for stale `lab.aaron.kr` references beyond WP's own search
  index (came back empty, but WP search doesn't deeply index post body HTML
  reliably — treat as reassuring, not conclusive).
- `aaronsnowberger.com` and `courses.aaron.kr` repos' own internal links —
  this audit only crawled aaron.kr.
