import type { HealthReport } from "@/lib/types";

/**
 * Kataloghub CWR-Ready / Validation-Readiness indicator.
 *
 * This is a *validation* signal, not a post-correction CWR-formatted-ready
 * signal. Kataloghub knows whether the catalog is structurally ready for
 * correction; it doesn't yet know whether HeyRoya will produce a clean
 * CWR file at the end.
 *
 * Tri-state per the Fortnox-style severity colors:
 *   blocking > 0                          → 🔴  Blocking issues remain
 *   blocking = 0 AND resolvable > 0       → 🟡  Ready for correction
 *   blocking = 0 AND resolvable = 0       → 🟢  Clean catalog · CWR-ready
 */
export function CwrReadyBadge({ report }: { report: HealthReport }) {
  const { blocking, resolvable } = report.counts;

  if (blocking > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-kh-red px-3 py-1 text-xs font-semibold text-white">
        <span aria-hidden>●</span> Blocking issues remain
      </span>
    );
  }
  if (resolvable > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-kh-yellow px-3 py-1 text-xs font-semibold text-black">
        <span aria-hidden>●</span> Ready for correction
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-kh-green px-3 py-1 text-xs font-semibold text-white">
      <span aria-hidden>✓</span> Clean catalog · CWR-ready
    </span>
  );
}
