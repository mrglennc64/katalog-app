"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV: { href: string; label: string; exact?: boolean }[] = [
  { href: "/kataloghub", label: "Dashboard", exact: true },
  { href: "/kataloghub/upload", label: "Ladda upp katalog" },
  { href: "/kataloghub/catalogs", label: "Kataloger" },
  { href: "/kataloghub/scans", label: "Skanningshistorik" },
  { href: "/kataloghub/worksheets", label: "Arbetsblad" },
  { href: "/kataloghub/tasks", label: "Uppgifter" },
  { href: "/kataloghub/compare", label: "Jämför skanningar" },
  { href: "/kataloghub/analytics/issues", label: "Vanliga avvikelser" },
  { href: "/kataloghub/analytics/health", label: "Hälsotrend" },
  { href: "/kataloghub/exports", label: "Exporter" },
  { href: "/kataloghub/limits", label: "Skanningsgränser" },
  { href: "/kataloghub/billing", label: "Fakturering" },
  { href: "/kataloghub/settings", label: "Inställningar" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 shrink-0 p-4 text-white"
      style={{ background: "var(--kh-nav-bg)" }}
    >
      <div className="mb-4 flex items-center justify-between px-3">
        <span className="text-base font-semibold tracking-wide">Kataloghub</span>
        <span className="inline-flex gap-1 rounded-full border border-white/20 p-0.5 text-[10px] font-bold">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-white">SV</span>
          <span className="px-2 py-0.5 text-white/50">EN</span>
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-kh-green text-white"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 px-3 text-[11px] leading-relaxed text-white/60">
        Filbaserat · Ingen systemåtkomst · Ingen ingestion
      </div>
    </aside>
  );
}
