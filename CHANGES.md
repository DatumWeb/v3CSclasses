# Changes from the original CS 356 site (`cs356`)

This repository is an improved version of the BYU Computer Science course browser that lived under `cs356/`. The following summarizes what changed for **CSV3** (this tree: `cs356CSV3`), with a focus on information design, visuals, and deployment.

## Visual and UX

- **Typography**: The app now uses [DM Sans](https://fonts.google.com/specimen/DM+Sans) for body text and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) for course codes and technical labels, instead of generic Arial and monospace defaults.
- **Layout and hierarchy**: A **sticky header** (`SiteHeader`) introduces consistent branding (“Brigham Young University”), page titles, and short descriptions. A **footer** (`SiteFooter`) states that data is unofficial and links to the [BYU Catalog](https://catalog.byu.edu/).
- **Background**: The page background uses a light cool-gray base with subtle radial gradients so the UI feels less flat than the plain white shell in `cs356`.
- **Course list**:
  - Search is a full-width field with a **search icon**, stronger focus styles, and rounded geometry.
  - Category filters are presented as **clear “Organize by” cards** with counts and improved empty states (search vs. “courses you can take”).
  - **Course cards** show level bands (e.g. 200-level), credit and semester **chips**, hover elevation, and a clearer path to the detail view.
- **Course detail**: Information is split into **card sections** (description, prerequisites, outcomes, notes) with a gradient hero area, metadata chips, and a primary “Open in BYU Catalog” action.
- **Prerequisite tree**: Nodes use rounded cards, clearer “Prerequisites” labels, and improved spacing; the tree page wraps the selector in an explanatory panel.
- **View switcher**: List vs. tree is a modern **segmented control** (“Prereq tree” label) aligned with the header.

## Technical / hosting

- **Static export for GitHub Pages**: `next.config.ts` sets `output: "export"`, `trailingSlash: true`, and optional `basePath` from the environment variable `BASE_PATH`. For a project site at `https://<user>.github.io/<repo>/`, set `BASE_PATH=/<repo>` when building (the included GitHub Actions workflow does this automatically using the repository name).
- **No Jekyll**: A `postbuild` script writes `out/.nojekyll` so GitHub Pages does not ignore static assets under `_next/` (Next does not always copy dotfiles from `public/`).
- **Prerendered course routes**: `src/app/course/[code]/page.tsx` exports `generateStaticParams()` so every course in `cs-courses.json` is built as static HTML at build time (replacing `force-dynamic` for this use case).
- **404 page**: A dedicated `not-found.tsx` matches the new visual language.
- **CI**: `.github/workflows/deploy-pages.yml` builds the `cs-course-browser` app and deploys the `out/` directory to GitHub Pages. In the repository **Settings → Pages**, set **Source** to **GitHub Actions** (not “Deploy from a branch”) so the workflow can publish.

## What stayed the same

- Core behavior: **search**, **category filters**, **“courses you can take”** (based on marked completions), **prerequisite resolution**, **localStorage** for completed courses, and **data shape** (`Course`, `loadCourses`, hierarchy config) are unchanged in spirit so existing JSON and scraper workflows still apply.
- The **scraper** (`scrape_cs.py`) and root **`cs-courses.json`** remain alongside the app for updating data.

## How to run locally

```bash
cd cs-course-browser
npm install
npm run dev
```

## How to build like GitHub Pages

From `cs-course-browser`, if your repo name is `my-repo`:

```bash
BASE_PATH=/my-repo npm run build
```

Open `out/index.html` via a local static server (paths are written for the given `BASE_PATH`).

---

*CSV3 is a course project iteration; always confirm critical academic requirements in official university sources.*
