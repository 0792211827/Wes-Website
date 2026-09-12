/**
 * GitHub API access with a mandatory fallback.
 *
 * CLAUDE.md §5: a GitHub API failure or rate-limit must never break a page
 * render. Every function here returns cached/static data instead of throwing.
 *
 * TODO(Phase 4): implement fetching, caching and the static fallback dataset.
 */

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  updatedAt: string;
};

export type GitHubResult<T> = {
  data: T;
  /** `true` when `data` came from the fallback rather than the live API. */
  stale: boolean;
};

/**
 * Static fallback served whenever the API is unavailable.
 *
 * TODO(Phase 4): populate from real repositories. Leave empty until then —
 * an empty list renders an empty state, invented repos would be a false claim.
 */
const FALLBACK_REPOS: Repo[] = [];

export async function getFeaturedRepos(): Promise<GitHubResult<Repo[]>> {
  // TODO(Phase 4): fetch from the GitHub API with revalidation, then fall back.
  return { data: FALLBACK_REPOS, stale: true };
}
