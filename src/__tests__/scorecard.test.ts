import { describe, it, expect } from "vitest";
import type { GitHubActivity, Scorecard } from "../types.js";

/** Helper to build a minimal activity fixture. */
function makeActivity(overrides: Partial<GitHubActivity> = {}): GitHubActivity {
  return {
    commits: [],
    pullRequests: [],
    issues: [],
    period: { since: "2025-01-01T00:00:00Z", until: "2025-01-08T00:00:00Z" },
    ...overrides,
  };
}

describe("Scorecard stats computation", () => {
  it("counts zero stats for empty activity", () => {
    const activity = makeActivity();
    const stats = computeStats(activity);

    expect(stats.totalCommits).toBe(0);
    expect(stats.totalPRsOpened).toBe(0);
    expect(stats.totalPRsMerged).toBe(0);
    expect(stats.totalIssuesOpened).toBe(0);
    expect(stats.totalIssuesClosed).toBe(0);
  });

  it("counts commits correctly", () => {
    const activity = makeActivity({
      commits: [
        { sha: "abc1234", message: "feat: add login", author: "alice", date: "2025-01-02" },
        { sha: "def5678", message: "fix: typo", author: "bob", date: "2025-01-03" },
      ],
    });
    const stats = computeStats(activity);

    expect(stats.totalCommits).toBe(2);
  });

  it("distinguishes merged vs open PRs", () => {
    const activity = makeActivity({
      pullRequests: [
        { number: 1, title: "Add feature", state: "closed", author: "alice", createdAt: "2025-01-02", mergedAt: "2025-01-03" },
        { number: 2, title: "WIP", state: "open", author: "bob", createdAt: "2025-01-04", mergedAt: null },
      ],
    });
    const stats = computeStats(activity);

    expect(stats.totalPRsOpened).toBe(2);
    expect(stats.totalPRsMerged).toBe(1);
  });

  it("distinguishes open vs closed issues", () => {
    const activity = makeActivity({
      issues: [
        { number: 10, title: "Bug", state: "closed", author: "alice", createdAt: "2025-01-02", closedAt: "2025-01-03", labels: ["bug"] },
        { number: 11, title: "Feature req", state: "open", author: "bob", createdAt: "2025-01-04", closedAt: null, labels: [] },
      ],
    });
    const stats = computeStats(activity);

    expect(stats.totalIssuesOpened).toBe(1);
    expect(stats.totalIssuesClosed).toBe(1);
  });
});

/**
 * Pure function that mirrors the stats logic in src/index.ts.
 * Extracted here so we can unit test it without spinning up the Worker.
 */
function computeStats(activity: GitHubActivity): Scorecard["stats"] {
  return {
    totalCommits: activity.commits.length,
    totalPRsOpened: activity.pullRequests.length,
    totalPRsMerged: activity.pullRequests.filter((pr) => pr.mergedAt !== null).length,
    totalIssuesOpened: activity.issues.filter((i) => i.state === "open").length,
    totalIssuesClosed: activity.issues.filter((i) => i.state === "closed").length,
  };
}
