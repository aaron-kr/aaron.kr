# Security Notes

## Email obfuscation

Contact email is obfuscated in all rendered HTML to reduce harvesting by spam bots.

**Technique used:**

- **Visible text** (`Footer.tsx`, `QRModal.tsx`): `dangerouslySetInnerHTML={{ __html: 'hi&#64;aaron.kr' }}` outputs the HTML entity `&#64;` in the raw page source instead of a literal `@`. Browsers render it normally; simple regex scrapers do not match it.
- **Mailto href** (`Hero.tsx` → `EmailLink.tsx`): The email `<a>` is a client component (`'use client'`). Server-rendered HTML contains only `href="#"`. The real `mailto:` address is set at runtime via `useEffect`, so it is never present in the static HTML delivered to crawlers.
- **VCard data** (`QRModal.tsx`): The `VCARD` string must contain the real address for QR scanning to work and is intentionally kept as-is. The QR modal is a client component; its content is not in server-rendered HTML.

## Address

Only city-level location ("Jeonju, South Korea" / "전주, 대한민국") is present in the codebase. No street address or postal code is present.

## Secrets / environment variables

- `.env.local` is gitignored — never committed.
- Vercel manages production env vars in its own dashboard.
- `NEXT_PUBLIC_GISCUS_REPO_ID` and `NEXT_PUBLIC_GISCUS_CATEGORY_ID` are intentionally public (they appear in the Giscus widget embed and in the client bundle by design).
- No API keys, tokens, or credentials were found in source files.

## Git author email

`git_author@email` appears in local `.git/logs` as the git author email. This is standard git metadata and is not part of the deployed site. It is visible in the GitHub commit history for the public repo — this is expected for a public open-source personal site.

## What cannot be fully hidden

- The email domain `aaron.kr` is the site's own domain and appears throughout as a URL. This is by design.
- The Giscus repo name (`aaron-kr/aaron.kr`) is a public GitHub repo. This is by design.
