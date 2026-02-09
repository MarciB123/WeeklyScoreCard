# CLAUDE.md — WeeklyScoreCard

This file provides guidance for AI assistants working on the WeeklyScoreCard repository.

## Project Overview

**WeeklyScoreCard** is a serverless API that generates AI-powered weekly development scorecards. It connects three services:

1. **GitHub API** (via Octokit) — fetches commits, pull requests, and issues for a repository
2. **Claude AI** (via Anthropic SDK) — analyzes the activity and produces a narrative scorecard with a score
3. **Cloudflare Workers** (via Hono) — hosts the API as a serverless edge function

## Repository Status

- **Remote**: `MarciB123/WeeklyScoreCard`
- **Primary branch**: `main`
- **Runtime**: Cloudflare Workers (Node.js-compatible)
- **Language**: TypeScript (strict mode)

## File Structure

```
WeeklyScoreCard/
├── CLAUDE.md               # AI assistant guidance (this file)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── wrangler.toml           # Cloudflare Workers config
├── vitest.config.ts        # Test runner config
├── .gitignore
├── .dev.vars.example       # Template for local secrets
└── src/
    ├── index.ts            # Worker entry point — Hono routes
    ├── types.ts            # Shared TypeScript interfaces
    ├── github.ts           # GitHub API integration (Octokit)
    ├── claude.ts           # Claude AI integration (Anthropic SDK)
    └── __tests__/
        └── scorecard.test.ts   # Unit tests for stats logic
```

## Key Commands

```bash
npm install              # Install dependencies
npm run dev              # Start local dev server (wrangler dev)
npm run deploy           # Deploy to Cloudflare Workers
npm test                 # Run tests (vitest)
npm run test:watch       # Run tests in watch mode
npm run lint             # Type-check with tsc --noEmit
```

## Project Setup

### Prerequisites

- Node.js >= 18
- npm
- A [Cloudflare account](https://dash.cloudflare.com/) (for deployment)
- A GitHub personal access token (for the GitHub API)
- An Anthropic API key (for Claude)

### Local Development

1. `npm install`
2. Copy `.dev.vars.example` to `.dev.vars` and fill in your secrets:
   ```
   GITHUB_TOKEN=ghp_...
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. `npm run dev` — starts the Worker locally at `http://localhost:8787`

### Deploying to Cloudflare

1. `npx wrangler login` — authenticate with Cloudflare
2. Set secrets:
   ```bash
   npx wrangler secret put GITHUB_TOKEN
   npx wrangler secret put ANTHROPIC_API_KEY
   ```
3. `npm run deploy`

## API Endpoints

| Method | Path                              | Description                          |
|--------|-----------------------------------|--------------------------------------|
| GET    | `/api/health`                     | Health check                         |
| POST   | `/api/scorecard`                  | Generate scorecard (JSON body)       |
| GET    | `/api/scorecard/:owner/:repo`     | Generate scorecard (path params)     |

### POST `/api/scorecard` body

```json
{
  "owner": "MarciB123",
  "repo": "WeeklyScoreCard",
  "since": "2025-01-01T00:00:00Z"   // optional, defaults to 7 days ago
}
```

### Response shape

```json
{
  "owner": "MarciB123",
  "repo": "WeeklyScoreCard",
  "period": { "since": "...", "until": "..." },
  "stats": {
    "totalCommits": 12,
    "totalPRsOpened": 3,
    "totalPRsMerged": 2,
    "totalIssuesOpened": 1,
    "totalIssuesClosed": 4
  },
  "analysis": "Claude's narrative analysis and score..."
}
```

## Architecture Notes

### Request Flow

```
Client → Cloudflare Worker (Hono router)
           ├─→ GitHub API (Octokit) — fetch weekly activity
           └─→ Claude AI (Anthropic SDK) — analyze activity
         ← JSON scorecard response
```

### Key Design Decisions

- **Hono** was chosen as the web framework for its lightweight size and first-class Cloudflare Workers support.
- **Octokit** is the official GitHub SDK — handles auth, pagination, and rate limiting.
- **Anthropic SDK** communicates directly with the Claude API for analysis.
- All modules are pure TypeScript with no Cloudflare-specific APIs beyond the Worker entry point, making them testable in isolation.

### Environment Bindings

Secrets are injected by Cloudflare Workers at runtime (see `Env` type in `src/types.ts`):
- `GITHUB_TOKEN` — GitHub personal access token
- `ANTHROPIC_API_KEY` — Anthropic API key
- `ENVIRONMENT` — set in `wrangler.toml` (currently `"production"`)

## Development Guidelines

### Git Workflow

- Create feature branches off `main` for all changes.
- Use clear, descriptive commit messages summarizing the "why" not just the "what".
- Push with `git push -u origin <branch-name>`.
- Open pull requests for review before merging to `main`.

### Code Conventions

- **TypeScript strict mode** — no `any` types without justification.
- Keep modules small and focused: `github.ts` owns GitHub concerns, `claude.ts` owns AI concerns.
- Export only what other modules need; keep helpers private.
- Use JSDoc comments on exported functions.

### Adding Dependencies

- Choose well-maintained, widely-used libraries.
- Pin dependency versions for reproducibility.
- Document why a dependency was added if the reason isn't obvious.

## Testing

- **Framework**: Vitest
- **Test location**: `src/__tests__/`
- **Naming convention**: `*.test.ts`
- **Run**: `npm test` or `npm run test:watch`

Tests focus on pure logic (stats computation, prompt building). Integration tests against live APIs should be added as the project matures, gated behind environment checks.

## Updating This File

Keep this file current as the project evolves. After significant changes (new endpoints, restructured directories, added tooling), update the relevant sections so AI assistants always have accurate context.
