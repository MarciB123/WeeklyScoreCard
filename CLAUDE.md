# CLAUDE.md — WeeklyScoreCard

This file provides guidance for AI assistants working on the WeeklyScoreCard repository.

## Project Overview

**WeeklyScoreCard** is an AI-powered weekly development scorecard API. It fetches GitHub repository activity (commits, PRs, issues) via the GitHub API, sends the data to Claude AI for analysis, and returns a structured JSON scorecard with raw stats and a narrative summary scored 0–100.

## Repository Status

- **Remote**: `MarciB123/WeeklyScoreCard`
- **Primary branch**: `main`
- **Type**: Backend API (Cloudflare Workers)
- **Language**: TypeScript (strict mode)
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Cloudflare Workers (serverless edge)
- **External APIs**: GitHub (Octokit), Anthropic Claude (`claude-sonnet-4-5-20250929`)
- **Testing**: Vitest
- **Formatter**: Prettier

## File Structure

```
WeeklyScoreCard/
├── CLAUDE.md                       # AI assistant guidance (this file)
├── README.md                       # Project documentation
├── package.json                    # Dependencies and npm scripts
├── tsconfig.json                   # TypeScript configuration (strict, ESNext, noEmit)
├── vitest.config.ts                # Vitest test runner configuration
├── wrangler.toml                   # Cloudflare Workers configuration
├── .dev.vars.example               # Template for local environment secrets
├── .gitignore                      # Git exclusions
└── src/
    ├── index.ts                    # Hono app entry point — API route definitions
    ├── types.ts                    # All TypeScript interfaces (Env, Scorecard, etc.)
    ├── github.ts                   # GitHub API integration (Octokit)
    ├── claude.ts                   # Claude AI analysis integration (Anthropic SDK)
    └── __tests__/
        └── scorecard.test.ts       # Unit tests for stats computation
```

## Architecture & Data Flow

```
Client Request
  → Hono route handler (src/index.ts)
    → fetchGitHubActivity() (src/github.ts)
      → Parallel fetch: commits, PRs, issues via Octokit
    → analyzeWithClaude() (src/claude.ts)
      → Builds markdown prompt, calls Claude Sonnet 4.5
    → Assemble Scorecard JSON response
  → Client Response
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check — returns `{ status: "ok", timestamp }` |
| `POST` | `/api/scorecard` | Generate scorecard — body: `{ owner, repo, since? }` |
| `GET` | `/api/scorecard/:owner/:repo` | Generate scorecard — optional `?since=ISO_DATE` query param |
| `*` | `*` | Fallback — returns 404 with endpoint list |

## Key Source Files

### `src/index.ts` — Application entry point
- Creates the Hono app with CORS middleware
- Defines all API routes
- Orchestrates GitHub fetch → Claude analysis → JSON response
- Computes stats inline (totalCommits, totalPRsOpened, totalPRsMerged, totalIssuesOpened, totalIssuesClosed)

### `src/types.ts` — Type definitions
- `Env` — Cloudflare Worker bindings (GITHUB_TOKEN, ANTHROPIC_API_KEY, ENVIRONMENT)
- `ScorecardRequest` — Input parameters (owner, repo, since?)
- `GitHubActivity` — Raw activity with commits, PRs, issues, and period
- `CommitSummary`, `PullRequestSummary`, `IssueSummary` — Individual item types
- `Scorecard` — Final response shape with stats and analysis

### `src/github.ts` — GitHub API integration
- `fetchGitHubActivity()` — Main export; fetches commits, PRs, and issues in parallel
- Default reporting window: last 7 days
- Fetches up to 100 items per category
- Filters out PRs from the issues endpoint (GitHub API returns both)
- Commit SHAs are truncated to 7 characters

### `src/claude.ts` — Claude AI analysis
- `analyzeWithClaude()` — Main export; builds a structured prompt and calls Claude
- Uses `claude-sonnet-4-5-20250929` model with max_tokens=1024
- Prompt requests: score (0–100), highlights, areas for improvement, summary

### `src/__tests__/scorecard.test.ts` — Unit tests
- Tests the stats computation logic (duplicated from index.ts as a pure function)
- Covers: empty activity, commit counting, PR merge distinction, issue open/closed distinction

## Environment Variables & Secrets

| Variable | Type | Description |
|----------|------|-------------|
| `GITHUB_TOKEN` | Secret | GitHub personal access token |
| `ANTHROPIC_API_KEY` | Secret | Anthropic API key for Claude |
| `ENVIRONMENT` | Var | Set to `"production"` in wrangler.toml |

Secrets are set via `wrangler secret put <NAME>` for production. For local development, copy `.dev.vars.example` to `.dev.vars` and fill in values. Never commit `.dev.vars`.

## NPM Scripts

```bash
npm run dev          # Start local dev server (wrangler dev) at localhost:8787
npm run deploy       # Deploy to Cloudflare Workers (wrangler deploy)
npm run test         # Run unit tests (vitest run)
npm run test:watch   # Run tests in watch mode (vitest)
npm run lint         # Type-check without emitting (tsc --noEmit)
npm run format       # Format code with Prettier (src/**/*.ts)
```

## Local Development

```bash
npm install
cp .dev.vars.example .dev.vars   # Then fill in real tokens
npm run dev                       # Starts at http://localhost:8787
curl http://localhost:8787/api/scorecard/MarciB123/WeeklyScoreCard
```

## Deployment (Cloudflare Workers)

```bash
npx wrangler login
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put ANTHROPIC_API_KEY
npm run deploy
```

## Development Guidelines

### Git Workflow

- Create feature branches off `main` for all changes.
- Use clear, descriptive commit messages summarizing the "why" not just the "what".
- Push with `git push -u origin <branch-name>`.
- Open pull requests for review before merging to `main`.

### Code Conventions

- All source code lives in the `src/` directory as TypeScript modules.
- TypeScript strict mode is enabled — do not use `any` types.
- Use ESM imports with `.js` extensions in import paths (required for Cloudflare Workers bundling).
- Use Hono's typed context (`c.env`, `c.req.json<T>()`) for type-safe request handling.
- Keep modules focused: `github.ts` for GitHub API calls, `claude.ts` for AI analysis, `types.ts` for interfaces.
- Format code with Prettier before committing (`npm run format`).
- Run `npm run lint` to type-check before pushing.

### Testing

- Tests use Vitest with globals enabled (no need to import `describe`, `it`, `expect` explicitly).
- Test files go in `src/__tests__/` with the `.test.ts` extension.
- Run `npm run test` to execute all tests.

### Adding New Endpoints

1. Define any new types in `src/types.ts`.
2. Add the route handler in `src/index.ts`.
3. If the endpoint needs external API calls, create a dedicated module in `src/`.
4. Add unit tests in `src/__tests__/`.

## Updating This File

Keep this file current as the project evolves. After significant changes (new endpoints, new integrations, changed architecture, dependency updates), update the relevant sections so AI assistants always have accurate context.
