"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

// Operator's main workflow lives entirely on the upload page:
// upload file → start validation → download CSV → send to HeyRoya.
// Everything else is secondary.
const PRIMARY: NavItem[] = [
  { href: "/kataloghub/upload", label: "Ladda upp katalog" },
];

const SECONDARY: NavItem[] = [
  { href: "/kataloghub/scan-history", label: "Skanningshistorik" },
  { href: "/kataloghub/health-report", label: "Hälsorapporter" },
  { href: "/kataloghub/tasks", label: "Uppgifter / Att åtgärda senare" },
  { href: "/kataloghub/exports", label: "Exporter" },
  { href: "/kataloghub/limits", label: "Skanningsgränser" },
  { href: "/kataloghub/billing", label: "Fakturering" },
  { href: "/kataloghub/settings", label: "Inställningar" },
];

function isActive(pathname: string | null, href: string, exact?: boolean) {
  if (!pathname) return false;
  return exact ? pathname === href : pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();
  const secondaryActive = SECONDARY.some((i) => isActive(pathname, i.href));

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-bg p-4">
      <div className="mb-4 flex items-center justify-between px-3">
        <span className="text-base font-semibold tracking-wide text-text">
          Kataloghub
        </span>
        <span className="inline-flex gap-0.5 rounded-full border border-border p-0.5 text-[10px] font-bold">
          <span className="rounded-full bg-kh-orange px-2 py-0.5 text-white">SV</span>
          <span className="px-2 py-0.5 text-text-muted">EN</span>
        </span>
      </div>

      <Link
        href="/kataloghub"
        className={`mb-3 block rounded px-3 py-2 text-sm transition-colors ${
          isActive(pathname, "/kataloghub", true)
            ? "bg-kh-orange/10 font-semibold text-kh-orange-dark"
            : "text-text-muted hover:bg-surface hover:text-text"
        }`}
      >
        Dashboard
      </Link>

      <nav className="flex flex-col gap-0.5">
        {PRIMARY.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`block rounded px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-kh-orange/10 font-semibold text-kh-orange-dark"
                  : "text-text hover:bg-surface"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <details className="mt-6 group" open={secondaryActive}>
        <summary className="cursor-pointer list-none px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted hover:text-text">
          <span className="inline-block w-3 transition-transform group-open:rotate-90">›</span>{" "}
          Verktyg &amp; inställningar
        </summary>
        <nav className="mt-1 flex flex-col gap-0.5">
          {SECONDARY.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded px-3 py-1.5 text-[13px] transition-colors ${
                  active
                    ? "bg-kh-orange/10 font-semibold text-kh-orange-dark"
                    : "text-text-muted hover:bg-surface hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </details>

      <div className="mt-8 px-3 text-[11px] leading-relaxed text-text-muted">
        Filbaserat · Ingen systemåtkomst
      </div>
    </aside>
  );
}
