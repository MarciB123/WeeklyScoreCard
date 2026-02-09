/** Environment bindings available in the Cloudflare Worker. */
export interface Env {
  GITHUB_TOKEN: string;
  ANTHROPIC_API_KEY: string;
  ENVIRONMENT: string;
}

/** Parameters for generating a weekly scorecard. */
export interface ScorecardRequest {
  /** GitHub owner (user or org), e.g. "MarciB123" */
  owner: string;
  /** Repository name, e.g. "WeeklyScoreCard" */
  repo: string;
  /** ISO date string for the start of the reporting window (defaults to 7 days ago) */
  since?: string;
}

/** Raw activity data fetched from GitHub. */
export interface GitHubActivity {
  commits: CommitSummary[];
  pullRequests: PullRequestSummary[];
  issues: IssueSummary[];
  period: { since: string; until: string };
}

export interface CommitSummary {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface PullRequestSummary {
  number: number;
  title: string;
  state: string;
  author: string;
  createdAt: string;
  mergedAt: string | null;
}

export interface IssueSummary {
  number: number;
  title: string;
  state: string;
  author: string;
  createdAt: string;
  closedAt: string | null;
  labels: string[];
}

/** The final scorecard returned to the caller. */
export interface Scorecard {
  owner: string;
  repo: string;
  period: { since: string; until: string };
  stats: {
    totalCommits: number;
    totalPRsOpened: number;
    totalPRsMerged: number;
    totalIssuesOpened: number;
    totalIssuesClosed: number;
  };
  /** Claude-generated narrative summary and score. */
  analysis: string;
}
