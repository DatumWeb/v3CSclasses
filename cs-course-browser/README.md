# BYU CS Course Explorer (CSV3)

Next.js app for browsing BYU Computer Science courses: search, filters, prerequisite planning, and a prerequisite tree. See **`../CHANGES.md`** in the repository root for what changed from the earlier `cs356` prototype.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Production build (static)

The app is configured for **static export** (`out/`), suitable for GitHub Pages or any static host.

```bash
npm run build
```

For a GitHub **project** site at `https://<user>.github.io/<repo>/`, set `BASE_PATH` to `/<repo>` when building so asset and link prefixes match:

```bash
BASE_PATH=/<your-repo-name> npm run build
```

Serve the `out/` folder with any static file server to verify.

## Data

`loadCourses()` reads `cs-courses.json` from the app’s `src/data/` copy or, when present, the parent directory’s `cs-courses.json`. After editing data at the repo root, copy or regenerate so `src/data/cs-courses.json` stays in sync before a **production** build (static HTML is generated at build time).

Refresh data with the scraper (from the repository root):

```bash
cd ..
python scrape_cs.py
```

## Hierarchy

Edit `src/config/hierarchy.ts` to change how filters group courses.

## Structure

- `src/types/course.ts` – Course shape.
- `src/config/hierarchy.ts` – Filter categories.
- `src/components/` – UI: `CourseBrowser`, `CourseDetail`, `PrereqTree`, `SiteHeader`, etc.
