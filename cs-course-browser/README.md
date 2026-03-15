# BYU CS Classes – Information Architecture Prototype

Bare-bones site to help CS students find information on CS classes. Built for the IA assignment; designed for easy reorganization after card sorting.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Data

The app loads course data at **runtime** from `../cs-courses.json` (project root). To refresh:

```bash
cd ..
python scrape_cs.py
```

Then refresh the browser — no rebuild needed. The scraper writes to the root; the app reads it on each request.

## Reorganizing the Hierarchy

Edit `src/config/hierarchy.ts`. The `PRIMARY_CATEGORIES` array defines how courses are grouped. Change the `label` and `matches` function for each category. No need to touch components.

## Structure

- **`src/types/course.ts`** – Course interface. Swap data sources by ensuring they conform to this shape.
- **`src/config/hierarchy.ts`** – Hierarchy config. Primary categories and rules.
- **`src/components/`** – Modular components: `CourseCard`, `CourseDetail`, `CategorySection`, `SearchFilter`, `CourseBrowser`.
