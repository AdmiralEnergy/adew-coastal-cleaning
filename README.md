# ADEW Coastal Cleaning Co. Website

Static, mobile-first site for ADEW Coastal Cleaning Co., built with HTML + Tailwind (CDN) + vanilla JS, ready for Netlify deploy with Netlify Forms and Functions that push submissions to Notion.

## Structure
```
/
├─ pages/                 # All site pages (served via redirects)
├─ styles/main.css        # Custom styling layered over Tailwind CDN
├─ scripts/main.js        # Nav + simple success banner handling
├─ public/images/         # Logo, favicon, hero placeholder
├─ netlify/functions/     # Notion sync handlers (ESM)
├─ netlify.toml           # Publish + redirects + functions path
├─ sitemap.xml, robots.txt
```

## Running locally
No build step needed.
```
# from repo root
npm install -g serve
serve .
# open http://localhost:3000/pages/index.html
```

## Deploying to Netlify
1) Create a new Netlify site, set **Publish directory** to `.` (root).
2) Add environment variables:
   - `NOTION_SECRET`
   - `NOTION_CLIENT_DB_ID` (for cleaning requests)
   - `NOTION_JOB_DB_ID` (for job applications)
3) Deploy. Redirects map friendly URLs (/, /services, /book, etc.) to `/pages/*.html`.

## Forms + Functions
- Netlify Forms are enabled on:
  - `pages/book.html` (`cleaning-request`)
  - `pages/careers.html` (`job-application`)
  - `pages/contact.html` (`contact`, optional Netlify-only)
- After deployment, Netlify will capture submissions and can trigger the functions:
  - `netlify/functions/notion-cleaning-request.js`
  - `netlify/functions/notion-job-application.js`
- Each function reads submission JSON and creates a page in the corresponding Notion database using the env vars above.

## Editing content
- Update copy directly in `pages/*.html`.
- Brand colors are defined in `styles/main.css` and Tailwind config snippets in each page head.
- Logo: `public/images/logo.svg` (text-based; swap with your own). Favicon: `public/images/favicon.ico`.
- Hero image: `public/images/hero.jpg` is a small placeholder; replace with a real coastal photo for production.

## Testing functions locally
```
netlify dev
# Submit the forms or POST to the function endpoints:
# /.netlify/functions/notion-cleaning-request
# /.netlify/functions/notion-job-application
```

## SEO
- Per-page `<title>`, meta description, OpenGraph tags.
- `sitemap.xml` and `robots.txt` at project root.
- LocalBusiness schema on the home page.

## Accessibility
- Semantic HTML, labels on all inputs, ARIA-friendly nav toggle, high-contrast palette.
