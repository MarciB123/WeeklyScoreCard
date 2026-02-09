# WeeklyScoreCard

AI-powered weekly development scorecards. Fetches your GitHub activity, sends it to Claude for analysis, and returns a structured scorecard — all running on Cloudflare Workers.

## How It Works

1. You call the API with a GitHub `owner/repo`.
2. The Worker fetches the past week's commits, PRs, and issues from the GitHub API.
3. Claude AI analyzes the activity and generates a score (0–100) with a narrative summary.
4. You get back a JSON scorecard with raw stats and the AI analysis.

## Quick Start

```bash
# Install dependencies
npm install

# Set up local secrets
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your GITHUB_TOKEN and ANTHROPIC_API_KEY

# Start the dev server
npm run dev

# Try it out
curl http://localhost:8787/api/scorecard/MarciB123/WeeklyScoreCard
```

## API

### `GET /api/scorecard/:owner/:repo`

Returns a scorecard for the given repository. Optional `?since=ISO_DATE` query param.

### `POST /api/scorecard`

```json
{ "owner": "MarciB123", "repo": "WeeklyScoreCard", "since": "2025-01-01T00:00:00Z" }
```

### `GET /api/health`

Returns `{ "status": "ok" }`.

## Deploy to Cloudflare

```bash
npx wrangler login
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put ANTHROPIC_API_KEY
npm run deploy
```

## Tech Stack

- **Cloudflare Workers** — serverless edge runtime
- **Hono** — lightweight web framework
- **Octokit** — official GitHub API client
- **Anthropic SDK** — Claude AI integration
- **TypeScript** — strict mode
- **Vitest** — test framework
