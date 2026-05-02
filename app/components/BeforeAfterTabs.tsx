"use client";

import { useState } from "react";
import type { HealthReport } from "@/lib/types";
import { HowToFix } from "./HowToFix";

export function BeforeAfterTabs({ report }: { report: HealthReport }) {
  const [tab, setTab] = useState<"before" | "after">("before");
  const after = report.residualIssueTypes ?? [];

  return (
    <div>
      <div className="mb-4 flex gap-1 border-b border-border">
        <button
          type="button"
          onClick={() => setTab("before")}
          className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${
            tab === "before"
              ? "border-kh-green font-semibold text-text"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          Before corrections
        </button>
        <button
          type="button"
          onClick={() => setTab("after")}
          className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${
            tab === "after"
              ? "border-kh-green font-semibold text-text"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          After corrections
        </button>
      </div>

      {tab === "before" ? (
        <ul className="m-0 list-none p-0">
          {report.issueTypes.map((it) => (
            <HowToFix key={it.field} issue={it} />
          ))}
        </ul>
      ) : after.length === 0 ? (
        <p className="text-sm text-text-muted">
          All issues resolved. Catalog is CWR-ready.
        </p>
      ) : (
        <ul className="m-0 list-none p-0">
          {after.map((it) => (
            <HowToFix key={it.field} issue={it} />
          ))}
        </ul>
      )}
    </div>
  );
}
