import Anthropic from "@anthropic-ai/sdk";
import type { GitHubActivity } from "./types.js";

/**
 * Sends the weekly GitHub activity to Claude and returns a
 * narrative analysis with a score.
 */
export async function analyzeWithClaude(
  apiKey: string,
  owner: string,
  repo: string,
  activity: GitHubActivity,
): Promise<string> {
  const client = new Anthropic({ apiKey });

  const prompt = buildPrompt(owner, repo, activity);

  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (block.type === "text") {
    return block.text;
  }
  return "Unable to generate analysis.";
}

function buildPrompt(owner: string, repo: string, activity: GitHubActivity): string {
  return `You are a developer-productivity analyst. Analyze the following weekly GitHub activity for the repository **${owner}/${repo}** and produce a concise scorecard.

## Reporting Period
${activity.period.since} → ${activity.period.until}

## Commits (${activity.commits.length})
${formatCommits(activity)}

## Pull Requests (${activity.pullRequests.length})
${formatPRs(activity)}

## Issues (${activity.issues.length})
${formatIssues(activity)}

---

Please provide:
1. **Score** (0–100) with a one-line rationale.
2. **Highlights** — the most impactful contributions this week.
3. **Areas for Improvement** — where the team could do better.
4. **Summary** — a 2-3 sentence narrative overview.

Keep the response concise and actionable.`;
}

function formatCommits(activity: GitHubActivity): string {
  if (activity.commits.length === 0) return "_No commits this period._";
  return activity.commits
    .map((c) => `- \`${c.sha}\` ${c.message} (${c.author}, ${c.date})`)
    .join("\n");
}

function formatPRs(activity: GitHubActivity): string {
  if (activity.pullRequests.length === 0) return "_No pull requests this period._";
  return activity.pullRequests
    .map((pr) => `- #${pr.number} ${pr.title} [${pr.state}] by ${pr.author}`)
    .join("\n");
}

function formatIssues(activity: GitHubActivity): string {
  if (activity.issues.length === 0) return "_No issues this period._";
  return activity.issues
    .map((i) => `- #${i.number} ${i.title} [${i.state}] by ${i.author}`)
    .join("\n");
}
