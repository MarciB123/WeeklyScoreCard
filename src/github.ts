import { Octokit } from "octokit";
import type { GitHubActivity, CommitSummary, PullRequestSummary, IssueSummary } from "./types.js";

/**
 * Fetches the past week's activity for a given GitHub repository.
 *
 * Pulls commits (from the default branch), pull requests, and issues
 * created or updated within the reporting window.
 */
export async function fetchGitHubActivity(
  token: string,
  owner: string,
  repo: string,
  since?: string,
): Promise<GitHubActivity> {
  const octokit = new Octokit({ auth: token });

  const sinceDate = since ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const untilDate = new Date().toISOString();

  const [commits, pullRequests, issues] = await Promise.all([
    fetchCommits(octokit, owner, repo, sinceDate, untilDate),
    fetchPullRequests(octokit, owner, repo, sinceDate),
    fetchIssues(octokit, owner, repo, sinceDate),
  ]);

  return {
    commits,
    pullRequests,
    issues,
    period: { since: sinceDate, until: untilDate },
  };
}

async function fetchCommits(
  octokit: Octokit,
  owner: string,
  repo: string,
  since: string,
  until: string,
): Promise<CommitSummary[]> {
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    since,
    until,
    per_page: 100,
  });

  return data.map((c) => ({
    sha: c.sha.slice(0, 7),
    message: c.commit.message.split("\n")[0],
    author: c.author?.login ?? c.commit.author?.name ?? "unknown",
    date: c.commit.author?.date ?? "",
  }));
}

async function fetchPullRequests(
  octokit: Octokit,
  owner: string,
  repo: string,
  since: string,
): Promise<PullRequestSummary[]> {
  const { data } = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "all",
    sort: "created",
    direction: "desc",
    per_page: 100,
  });

  const sinceTime = new Date(since).getTime();

  return data
    .filter((pr) => new Date(pr.created_at).getTime() >= sinceTime)
    .map((pr) => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      author: pr.user?.login ?? "unknown",
      createdAt: pr.created_at,
      mergedAt: pr.merged_at,
    }));
}

async function fetchIssues(
  octokit: Octokit,
  owner: string,
  repo: string,
  since: string,
): Promise<IssueSummary[]> {
  const { data } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    state: "all",
    since,
    per_page: 100,
  });

  // The issues endpoint also returns pull requests; filter them out.
  return data
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      number: issue.number,
      title: issue.title,
      state: issue.state,
      author: issue.user?.login ?? "unknown",
      createdAt: issue.created_at,
      closedAt: issue.closed_at,
      labels: issue.labels.map((l) => (typeof l === "string" ? l : l.name ?? "")),
    }));
}
