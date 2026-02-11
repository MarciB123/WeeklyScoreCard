# CLAUDE.md — WeeklyScoreCard

This file provides guidance for AI assistants working on the WeeklyScoreCard repository.

## Project Overview

**WeeklyScoreCard** is a web-based weekly performance tracker for 4 restaurant locations (Cardiff, Carlsbad, Del Mar, Carmel Valley). It displays a rolling 10-week view of key metrics including sales, labor costs, ticket times, and reviews.

## Repository Status

- **Remote**: `MarciB123/WeeklyScoreCard`
- **Primary branch**: `main`
- **Type**: Static single-page application (SPA)
- **Framework**: React 18 (loaded via CDN)
- **Styling**: Tailwind CSS (loaded via CDN)
- **Hosting**: Cloudflare Workers (static HTML file)
- **Data Storage**: Browser localStorage (data persists per device/browser)
- **Build Process**: None required — single HTML file runs directly in browser

## File Structure

```
WeeklyScoreCard/
├── CLAUDE.md               # AI assistant guidance (this file)
├── index.html              # The entire application (single file)
└── ...
```

The application is a single `index.html` file containing all HTML, CSS, and JavaScript. React and Tailwind CSS are loaded from CDN.

## Current Features

- **4 store tabs** — Click to switch between locations (Cardiff, Carlsbad, Del Mar, Carmel Valley)
- **Rolling 10-week view** — Most recent week at top, oldest at bottom (shows actual dates like "1/27-2/2")
- **Auto-calculated fields**:
  - Sales vs Goal %
  - Sales vs Forecast $
  - Sales vs Last Week (up/down arrows)
  - Labor Cost %
  - Labor Goal %
- **Color coding** — Green when hitting goals, red when missing
- **Locked fields** — Sales Goal, Labor Goal, Hours Allowed (managed separately)
- **10-Week Averages panel** — Shows avg sales, avg labor cost %, avg ticket time, avg reviews per week
- **Save Data button** — Saves data to browser localStorage
- **Add New Week button** — Protected by access code entry
- **Number formatting** — Dollar signs and commas auto-added (e.g., $25,000)

## Data Columns (in order)

1. Week (date range)
2. Sales Actual
3. vs Last Wk
4. Sales Goal (locked)
5. Sales vs Goal %
6. Sales Forecast
7. Sales vs Forecast $
8. Labor Actual $
9. Labor Forecast $
10. Labor Goal $ (locked)
11. Labor Cost %
12. Labor Goal %
13. Hours Used
14. Hours Scheduled
15. Hours Allowed (locked)
16. Tickets
17. Ticket Time
18. Reviews

## Access Codes

- **2046** — Adds a new week (shifts all data forward)
- **5069** — Removes a week (shifts all data backward)

## Locked Fields

These fields are managed separately and not editable in the normal data entry flow:
- Sales Goal
- Labor Goal
- Hours Allowed

## Deployment (Cloudflare Workers)

1. Go to dash.cloudflare.com
2. Click **Workers & Pages** in sidebar
3. Select your project or create new one
4. Click **Deployments** > **Create deployment**
5. Create a folder containing `index.html`
6. Drag the folder into the upload box
7. Click **Deploy**
8. Access via your `.pages.dev` URL

## Local Testing

Double-click `index.html` to open in a browser. No build step or server required.

## Code Rules

- File must be named exactly `index.html` — required for web hosting
- Save as plain text — no rich text formatting
- Test locally first — open in browser before uploading to Cloudflare
- Data saves to browser localStorage — persists on the same device/browser
- All code (HTML, CSS, JavaScript/React) lives in the single `index.html` file
- React 18 is loaded via CDN (not installed locally)
- Tailwind CSS is loaded via CDN (not installed locally)

## Design Specs

- **Font**: Default system font
- **Colors**: Default Tailwind colors — blue tabs, green/red for goal indicators, purple save button
- **Number format**: Dollar signs on money fields, commas for thousands, "min" suffix on ticket time

## Development Guidelines

### Git Workflow

- Create feature branches off `main` for all changes.
- Use clear, descriptive commit messages summarizing the "why" not just the "what".
- Push with `git push -u origin <branch-name>`.
- Open pull requests for review before merging to `main`.

### Code Conventions

- Keep all code in the single `index.html` file.
- Use React functional components with hooks for state management.
- Use Tailwind utility classes for styling.
- Maintain clear separation between data logic and presentation within the file.

## Updating This File

Keep this file current as the project evolves. After significant changes (new features, new columns, changed access codes, styling changes), update the relevant sections so AI assistants always have accurate context.
