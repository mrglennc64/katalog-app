"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV: { href: string; label: string }[] = [
  { href: "/", label: "Dashboard" },
  { href: "/upload", label: "Upload Catalog" },
  { href: "/scan-history", label: "Scan History" },
  { href: "/worksheets", label: "Worksheets" },
  { href: "/exports", label: "Exports" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 shrink-0 p-4 text-white"
      style={{ background: "var(--kh-nav-bg)" }}
    >
      <div className="mb-6 px-3 text-base font-semibold tracking-wide">
        Kataloghub
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded px-3 py-2 text-sm transition-colors ${
                active ? "bg-kh-green text-white" : "text-white/90 hover:bg-white/10"
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
