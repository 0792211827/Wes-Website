/**
 * Privacy-conscious analytics wrapper.
 *
 * Scaffolding only — no provider is wired up yet. Everything goes through
 * `trackEvent` so the provider can be swapped in one place, and so nothing
 * personally identifying is ever passed by accident.
 *
 * TODO(Phase 1/4): pick a cookieless provider and implement `send()`.
 * Constraints: no cookies, no cross-site identifiers, respect Do Not Track,
 * must not block first paint.
 */

export type AnalyticsEvent = {
  name: string;
  /** Non-identifying properties only. No emails, names, IPs or free text. */
  props?: Record<string, string | number | boolean>;
};

/** Analytics is opt-in per environment; absent config means disabled. */
export function isAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN);
}

function respectsDoNotTrack(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.doNotTrack === "1";
}

export function trackEvent(event: AnalyticsEvent): void {
  if (!isAnalyticsEnabled() || respectsDoNotTrack()) return;
  // TODO: forward `event` to the chosen provider.
  void event;
}

export function trackPageView(pathname: string): void {
  trackEvent({ name: "pageview", props: { pathname } });
}
