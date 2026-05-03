"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
  children?: { href: string; label: string }[];
};

const NAV: NavItem[] = [
  { href: "/kataloghub", label: "Dashboard", exact: true },
  { href: "/kataloghub/upload", label: "1. Ladda upp katalog" },
  {
    href: "/kataloghub/scans",
    label: "2. Skanningar",
    children: [{ href: "/kataloghub/scans", label: "Skanningshistorik" }],
  },
  {
    href: "/kataloghub/scans",
    label: "3. Scan-resultat & hälsorapporter",
    children: [
      { href: "/kataloghub/scans", label: "Scan-resultat" },
      { href: "/kataloghub/scans", label: "Hälsorapporter" },
    ],
  },
  { href: "/kataloghub/worksheets", label: "4. Arbetsblad" },
  { href: "/kataloghub/tasks", label: "5. Uppgifter / Att åtgärda senare" },
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

      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          const hasChildren = item.children && item.children.length > 0;
          const groupActive =
            active ||
            (item.children?.some((c) => isActive(pathname, c.href)) ?? false);

          return (
            <div key={item.label}>
              <Link
                href={item.href}
                className={`block rounded px-3 py-2 text-sm transition-colors ${
                  groupActive && !hasChildren
                    ? "bg-kh-orange/10 font-semibold text-kh-orange-dark"
                    : groupActive && hasChildren
                      ? "font-semibold text-text"
                      : "text-text hover:bg-surface"
                }`}
              >
                {item.label}
              </Link>
              {hasChildren && (
                <div className="mt-0.5 ml-3 flex flex-col gap-0.5 border-l border-border pl-2">
                  {item.children!.map((child, i) => {
                    const childActive = isActive(pathname, child.href);
                    return (
                      <Link
                        key={`${child.label}-${i}`}
                        href={child.href}
                        className={`block rounded px-3 py-1.5 text-[13px] transition-colors ${
                          childActive
                            ? "bg-kh-orange/10 font-semibold text-kh-orange-dark"
                            : "text-text-muted hover:bg-surface hover:text-text"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-8 px-3 text-[11px] leading-relaxed text-text-muted">
        Filbaserat · Ingen systemåtkomst · Ingen ingestion
      </div>
    </aside>
  );
}
