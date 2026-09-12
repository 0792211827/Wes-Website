import Link from "next/link";
import {
  isPlaceholder,
  primaryNav,
  secondaryNav,
  siteConfig,
  utilityNav,
} from "@/config/site";

/**
 * Site footer. Server component — no interactivity.
 *
 * External links whose URL is still a `TODO:` placeholder render as plain text
 * rather than dead links, so an unfilled value is visible but not clickable.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {siteConfig.name}
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <nav aria-label="Footer">
              <h2 className="text-xs font-medium tracking-wide text-subtle uppercase">
                Site
              </h2>
              <ul className="mt-3 space-y-2">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Elsewhere">
              <h2 className="text-xs font-medium tracking-wide text-subtle uppercase">
                Elsewhere
              </h2>
              <ul className="mt-3 space-y-2">
                {secondaryNav.map((item) => (
                  <li key={item.label}>
                    {isPlaceholder(item.href) ? (
                      <span className="text-sm text-subtle">{item.label}</span>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-subtle">
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
          <ul className="flex gap-4">
            {utilityNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs text-subtle transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
