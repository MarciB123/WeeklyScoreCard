import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env, ScorecardRequest, Scorecard } from "./types.js";
import { fetchGitHubActivity } from "./github.js";
import { analyzeWithClaude } from "./claude.js";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

// ── Health check ────────────────────────────────────────────────
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Generate a weekly scorecard ─────────────────────────────────
app.post("/api/scorecard", async (c) => {
  const body = await c.req.json<ScorecardRequest>();

  if (!body.owner || !body.repo) {
    return c.json({ error: "owner and repo are required" }, 400);
  }

  // 1. Fetch activity from GitHub
  const activity = await fetchGitHubActivity(
    c.env.GITHUB_TOKEN,
    body.owner,
    body.repo,
    body.since,
  );

  // 2. Ask Claude to analyze the activity
  const analysis = await analyzeWithClaude(
    c.env.ANTHROPIC_API_KEY,
    body.owner,
    body.repo,
    activity,
  );

  // 3. Build the response
  const scorecard: Scorecard = {
    owner: body.owner,
    repo: body.repo,
    period: activity.period,
    stats: {
      totalCommits: activity.commits.length,
      totalPRsOpened: activity.pullRequests.length,
      totalPRsMerged: activity.pullRequests.filter((pr) => pr.mergedAt !== null).length,
      totalIssuesOpened: activity.issues.filter((i) => i.state === "open").length,
      totalIssuesClosed: activity.issues.filter((i) => i.state === "closed").length,
    },
    analysis,
  };

  return c.json(scorecard);
});

// ── Convenience GET endpoint (owner/repo in path) ───────────────
app.get("/api/scorecard/:owner/:repo", async (c) => {
  const owner = c.req.param("owner");
  const repo = c.req.param("repo");
  const since = c.req.query("since");

  const activity = await fetchGitHubActivity(
    c.env.GITHUB_TOKEN,
    owner,
    repo,
    since ?? undefined,
  );

  const analysis = await analyzeWithClaude(
    c.env.ANTHROPIC_API_KEY,
    owner,
    repo,
    activity,
  );

  const scorecard: Scorecard = {
    owner,
    repo,
    period: activity.period,
    stats: {
      totalCommits: activity.commits.length,
      totalPRsOpened: activity.pullRequests.length,
      totalPRsMerged: activity.pullRequests.filter((pr) => pr.mergedAt !== null).length,
      totalIssuesOpened: activity.issues.filter((i) => i.state === "open").length,
      totalIssuesClosed: activity.issues.filter((i) => i.state === "closed").length,
    },
    analysis,
  };

  return c.json(scorecard);
});

// ── Fallback ────────────────────────────────────────────────────
app.all("*", (c) => {
  return c.json(
    {
      message: "WeeklyScoreCard API",
      endpoints: [
        "GET  /api/health",
        "POST /api/scorecard         { owner, repo, since? }",
        "GET  /api/scorecard/:owner/:repo?since=ISO_DATE",
      ],
    },
    404,
  );
});

export default app;
