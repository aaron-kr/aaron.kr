# Accessibility Audit — aaron.kr Next.js 15 Site

**Audited:** 2026-04-30  
**Auditor:** Claude Code (automated review of all TSX/CSS source files)  
**Scope:** All components in `components/`, all pages in `app/`, `globals.css`, `next.config.ts`

---

## Summary

| Category | Issues Found | Fixed | Manual Action Needed |
|---|---|---|---|
| Skip link | 1 | 1 | — |
| Focus styles | 1 | 1 | Manual contrast check |
| Landmark roles / nav aria-label | 4 | 4 | — |
| Language attribute | 0 | — | — |
| Heading hierarchy | 0 | — | — |
| Images: missing alt text | 2 | 2 | — |
| Images: raw `<img>` for content | 10 | 8 | 2 acceptable exceptions |
| Large images in public/img | 5 | Noted | Use next/image via CSS only |
| Interactive elements / aria-label | 3 | 3 | — |
| Decorative SVG aria-hidden | 8 | 8 | — |
| Modal accessibility | 1 | 1 | Focus trap not implemented |
| Color contrast | Partial | — | Manual verification needed |
| Forms | 1 | 1 | — |
| WordPress rendered content | — | — | Cannot audit statically |

---

## Fixes Implemented

### 1. Skip Link (app/layout.tsx + globals.css)

**Issue:** No skip-to-main-content link existed. Keyboard users must tab through the entire navigation on every page.

**Fix:** Added a visually hidden skip link as the first element in `<body>` that becomes visible on focus:

```tsx
// app/layout.tsx
<a href="#main-content" className="skip-link">Skip to main content</a>
```

```css
/* globals.css */
.skip-link {
  position:fixed; top:-100%; left:1rem; z-index:9999;
  background:var(--teal); color:#000; ...
}
.skip-link:focus { top:0; }
```

All `<main>` elements across every route now have `id="main-content"`:
- `app/page.tsx`
- `app/writing/page.tsx`
- `app/portfolio/page.tsx`
- `app/category/[slug]/page.tsx`
- `app/tag/[slug]/page.tsx`
- `components/PostLayout.tsx`

---

### 2. Global Focus Styles (globals.css)

**Issue:** No `:focus-visible` styles were defined. The CSS reset (`*,*::before,*::after { margin:0; padding:0; ... }`) and no explicit `outline` definition means browser default focus rings may be suppressed or inconsistent.

**Fix:** Added a global `:focus-visible` rule:

```css
:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 3px;
  border-radius: 3px;
}
```

**Manual action needed:** Verify focus rings are visible on both dark and light themes, especially on nav buttons, share buttons, and pagination links.

---

### 3. Screen-Reader Utility Class (globals.css)

**Issue:** No `.sr-only` utility existed for visually hiding content intended only for screen readers.

**Fix:** Added standard `.sr-only` class to globals.css.

---

### 4. Navigation aria-label (components/Nav.tsx)

**Issue:** Both `<nav>` elements (primary nav bar and mobile menu) had no `aria-label`, creating duplicate unnamed navigation landmarks.

**Fix:**
```tsx
<nav aria-label="Primary">           // main nav bar
<nav aria-label="Mobile menu">      // mobile overlay
```

---

### 5. Aurora Button aria-label (components/Nav.tsx)

**Issue:** The aurora toggle button had `aria-pressed` and `title` but no `aria-label`. Screen readers would announce the Unicode star character `✦` literally.

**Fix:** Added `aria-label="Toggle aurora effect"` and wrapped the decorative glyph in `aria-hidden="true"`.

---

### 6. Theme Toggle Button (components/Nav.tsx)

**Issue:** `aria-label="Toggle theme"` was generic. When the label is "Toggle theme" but the button shows ☀ or ☾, screen readers don't convey current state or the action being performed.

**Fix:** Made the label state-aware:
```tsx
aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
```
The emoji glyphs are now wrapped in `aria-hidden="true"`.

---

### 7. Hero Social Link aria-labels + Decorative SVGs (components/Hero.tsx)

**Issue:** All six social links (LinkedIn, GitHub, ResearchGate, Scholar, ORCID, KSPAI) plus the email link had no `aria-label` and their SVG icons had no `aria-hidden`. Screen readers would read SVG paths as text.

**Fix:** Added `aria-label="[Platform] (opens in new tab)"` to each link and `aria-hidden="true"` to all decorative SVGs.

---

### 8. Hero CTA Link (components/Hero.tsx)

**Issue:** The "Student Courses" CTA link had no `aria-label` and its external-link SVG icon had no `aria-hidden`.

**Fix:** Added `aria-label="Student Courses (opens in new tab)"` and `aria-hidden="true"` on the icon SVG.

---

### 9. University / Client Logo Strips (Teaching.tsx, Design.tsx)

**Issue:** University logos and client logos were wrapped in `<a>` tags with no `href` attribute, making them non-functional links rendered as invalid anchors. The alt text was also too terse (e.g., `"JBNU"` instead of the full university name).

**Fix:**
- Changed `<a>` wrappers to `<span>` (not interactive) with `role="img"` and `aria-label` set to the full institution name.
- Set `alt=""` on each logo image (decorative, since the parent `<span>` provides the name).
- Expanded alt text in the UNIVERSITIES array to include full institution names.
- Converted `<img>` to `next/image` `<Image>` with explicit `width`/`height`.

---

### 10. WyoKoreaSlider range input (components/WyoKoreaSlider.tsx)

**Issue:** The `<input type="range">` had no accessible label. There is no associated `<label>` element and no `aria-label` or `aria-labelledby`.

**Fix:**
```tsx
aria-label="Compare Wyoming and Korea — drag to reveal"
```

---

### 11. Footer Navigation (components/Footer.tsx)

**Issue:** The footer links section was a plain `<div>` with no landmark role. The Wyoming cowboy link had a `title` attribute but no `aria-label` for external destination clarity.

**Fix:**
- Changed `<div className="foot-links">` to `<nav className="foot-links" aria-label="Footer links">`.
- Added `aria-label="Wyoming, USA — Big Sky Country (opens in new tab)"` to the Wyoming Wikipedia link.
- Improved `alt` text from `"Wyoming Cowboy"` to `"Wyoming Cowboy silhouette"`.

---

### 12. QR Modal accessibility (components/QRModal.tsx)

**Issue:** The modal container had no `aria-hidden` when closed, meaning screen readers could still traverse its content when not visible.

**Fix:** Added `aria-hidden={!open}` to the `.modal-bg` wrapper div.

---

### 13. Scroll Progress Bar (all pages)

**Issue:** The `<div id="prog">` animated progress bar had no ARIA attributes, potentially confusing screen readers.

**Fix:** Added `role="progressbar" aria-label="Page scroll progress" aria-hidden="true"` to all instances across 6 files.

---

### 14. Raw `<img>` → `next/image` Conversions

All of the following were converted to use the `next/image` `<Image>` component for automatic optimization, lazy loading, WebP conversion, and proper `sizes` attributes:

| Location | Images Converted |
|---|---|
| `components/Beyond.tsx` | Featured category images (local + WP URLs) |
| `components/Design.tsx` | Portfolio grid images (WP URLs), client logos |
| `components/Teaching.tsx` | University logo strip |
| `components/PostFooter.tsx` | "Continue Reading" related post images |
| `components/PostLayout.tsx` | Featured image (both post and portfolio types) |
| `components/PostSidebar.tsx` | Author avatar |
| `app/portfolio/page.tsx` | Portfolio archive grid images |

**Added to `next.config.ts` remotePatterns:**
- `secure.gravatar.com` — for WordPress author avatars
- `*.gravatar.com` — for all Gravatar subdomains

---

### 15. `<img>` Tags Intentionally Kept

| Location | Reason |
|---|---|
| `components/Footer.tsx` — Wyoming cowboy `.webp` | Small decorative image (60px tall), `loading="lazy"`, good alt text. Converting adds no meaningful benefit. |
| `components/PostLightbox.tsx` — lightbox viewer | Dynamically extracted from DOM at runtime. Image URLs are arbitrary — cannot use `next/image` without knowing all possible remote origins at build time. |

---

## Performance Notes on Large Images in public/img/

The following large images exist in `public/img/` and are used **only** as CSS `background-image` values (not as `<img>` tags). CSS backgrounds cannot use `next/image` optimization. These are significant performance concerns:

| File | Size | Used In |
|---|---|---|
| `wyoming-tetons-mohann.jpg` | 5.8 MB | Not found in code — may be unused |
| `wyoming-yellowstone-plains.jpg` | 4.8 MB | `Beyond.tsx` fallback (converted to `<Image>`) |
| `korea-jeonju-hanok-village.jpg` | 4.6 MB | `globals.css` `.cmp-r` background |
| `wyoming-tetons-oxbow-bend.jpg` | ~3 MB | `globals.css` `.cmp-l` background |
| `hangul-papers.jpg` | — | `globals.css` hero + footer manuscript texture |

**Recommended actions:**
1. **Compress all images** in `public/img/` using a tool like `sharp`, `squoosh`, or `ImageMagick`. Target <200KB for background images.
2. **wyoming-tetons-mohann.jpg** — Appears unused in the codebase. Verify and delete if so.
3. **Slider images** (`cmp-l`, `cmp-r` CSS backgrounds) cannot use `next/image` but should be compressed aggressively since they load on every page visit (the slider is above the fold on homepage).
4. Consider converting JPEG backgrounds to WebP or AVIF manually.

---

## Items Needing Manual Attention

### Color Contrast

The design uses CSS custom properties that change between dark and light themes. Key pairs to check manually with a contrast checker:

| Element | Dark theme | Light theme |
|---|---|---|
| Body text `--t2` on `--bg` | `#7ea89e` on `#0c0f0e` | `#3e5750` on `#f8faf9` |
| Body text `--t3` on `--bg` | `#3e5852` on `#0c0f0e` | `#8aa29b` on `#f8faf9` |
| Nav links `--t2` on nav-bg | Semi-transparent overlay | Semi-transparent overlay |
| Tag text `--teal` on bg | `#2dd4bf` on `#0c0f0e` | `#0a8c78` on `#f8faf9` |

**Concern:** `--t3` (`#3e5852` dark / `#8aa29b` light) is used for secondary labels throughout — likely fails WCAG AA 4.5:1 ratio for small text in both themes. Verify and consider lightening (dark) or darkening (light) this token.

### QR Modal — Focus Trap

**Issue not fixed:** The `QRModal` opens as a dialog but does not implement focus trapping. When the modal opens, keyboard users can still Tab to elements behind the modal overlay.

**Recommended fix:** Use the native `<dialog>` element (which provides built-in focus trapping and `Escape` handling), or implement a focus trap with `inert` on the background content when the modal is open.

### PostLayout — WordPress Content Images

The `<div className="wp-content" dangerouslySetInnerHTML=... />` renders arbitrary WordPress HTML. Any `<img>` tags within WP post content are not optimized and their alt text depends entirely on what was entered in the WordPress media library. 

**Recommended actions:**
1. Audit WordPress media items to ensure all images have descriptive alt text set.
2. Consider a post-processing step that replaces `<img>` tags in rendered WP HTML with next/image-compatible markup, or use a WordPress plugin that outputs `loading="lazy"` and proper `width`/`height` attributes on all images.

### Mobile Nav — Duplicate Content

The mobile nav (`mob-menu`) duplicates every nav link from the desktop nav. This means screen readers encounter every link twice in the DOM (once in the desktop nav, once in the mobile nav). Only one nav is visually visible at a time but both are in the DOM.

**Recommended fix:** Add `aria-hidden="true"` to the nav that is currently hidden (the one not visible). This requires a client-side effect to toggle `aria-hidden` based on `mobileOpen` state and viewport width.

### Bilingual Content

The bilingual system hides `.en` or `.ko` spans with `display:none` via `[data-lang] .en/ko` CSS. Hidden elements with `display:none` are correctly excluded from the accessibility tree, so this is acceptable. However:
- The `lang` attribute on `<html>` is always `"en"` regardless of the `data-lang` setting. If a user switches to Korean (`data-lang="ko"`), screen readers will still announce Korean text using English phonetics.

**Recommended fix:** Dynamically update `<html lang="...">` when `data-lang` changes (in `Nav.tsx` `toggleLang` function).

---

## Files Changed

| File | Change |
|---|---|
| `app/globals.css` | Added `.skip-link`, `.sr-only`, `:focus-visible` rules |
| `app/layout.tsx` | Added skip link `<a>` in `<body>` |
| `app/page.tsx` | Added `id="main-content"` on `<main>`, improved `#prog` attributes |
| `app/writing/page.tsx` | Added `id="main-content"`, improved `#prog`, Korean link `aria-label` |
| `app/portfolio/page.tsx` | Added `id="main-content"`, improved `#prog`, converted grid `<img>` → `<Image>` |
| `app/category/[slug]/page.tsx` | Added `id="main-content"`, improved `#prog` |
| `app/tag/[slug]/page.tsx` | Added `id="main-content"`, improved `#prog` |
| `components/Nav.tsx` | Added `aria-label` to both navs, fixed aurora/theme button labels |
| `components/Hero.tsx` | Added `aria-label` to all social links, `aria-hidden` to all decorative SVGs |
| `components/WyoKoreaSlider.tsx` | Added `aria-label` to range input |
| `components/Footer.tsx` | Changed links div to `<nav aria-label="Footer links">`, improved Wyoming link |
| `components/Teaching.tsx` | Added `Image` import, full alt text, `<span role="img">` wrappers, `<Image>` for logos |
| `components/Design.tsx` | Added `Image` import, `<span role="img">` wrappers, `<Image>` for grid + logos |
| `components/Beyond.tsx` | Added `Image` import, converted category images to `<Image fill>` |
| `components/PostLayout.tsx` | Added `Image` import, converted featured images to `<Image>`, improved `#prog` |
| `components/PostFooter.tsx` | Added `Image` import, converted related post images to `<Image>` |
| `components/PostSidebar.tsx` | Added `Image` import, converted author avatar to `<Image>` |
| `components/QRModal.tsx` | Added `aria-hidden={!open}` |
| `next.config.ts` | Added `secure.gravatar.com` and `*.gravatar.com` to remotePatterns |
