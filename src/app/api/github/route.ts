import { NextResponse } from "next/server";
import { getFeaturedRepos } from "@/lib/github";

/**
 * GitHub API proxy. Keeps the token server-side and guarantees the fallback
 * contract from CLAUDE.md §5 — this route always answers 200 with data, so a
 * GitHub outage or rate-limit can never break a page render.
 *
 * TODO(Phase 4): real fetching + caching lives in @/lib/github.
 */
export async function GET() {
  const { data, stale } = await getFeaturedRepos();
  return NextResponse.json({ repos: data, stale });
}
