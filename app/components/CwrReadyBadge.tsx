import type { HealthReport } from "@/lib/types";

export function CwrReadyBadge({ report }: { report: HealthReport }) {
  const ready =
    report.status === "cwr-ready" &&
    report.counts.blocking === 0 &&
    report.counts.residual === 0;

  if (ready) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-kh-green px-3 py-1 text-xs font-semibold text-white">
        <span aria-hidden>✓</span> CWR-ready
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-kh-yellow px-3 py-1 text-xs font-semibold text-black">
      <span aria-hidden>!</span> Issues detected
    </span>
  );
}
