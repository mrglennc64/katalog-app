"use client";

import { useState } from "react";
import type { IssueType } from "@/lib/types";
import { Pill } from "./Pill";

const TONE = {
  blocking: "red" as const,
  resolvable: "yellow" as const,
  residual: "neutral" as const,
  clean: "green" as const,
};

const DOT = {
  blocking: "bg-kh-red",
  resolvable: "bg-kh-yellow",
  residual: "bg-border",
  clean: "bg-kh-green",
};

export function IssueCategoryGrid({ issues }: { issues: IssueType[] }) {
  const [selectedField, setSelectedField] = useState<string | null>(
    issues[0]?.field ?? null,
  );
  const selected = issues.find((i) => i.field === selectedField) ?? null;

  if (issues.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        No issue categories — catalog passes all validation rules.
      </p>
    );
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {issues.map((it) => {
          const active = it.field === selectedField;
          return (
            <button
              key={it.field}
              type="button"
              onClick={() => setSelectedField(it.field)}
              className={`flex items-center gap-3 rounded border bg-bg p-3 text-left transition-colors ${
                active
                  ? "border-kh-green ring-1 ring-kh-green"
                  : "border-border hover:border-text-muted"
              }`}
            >
              <span
                aria-hidden
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT[it.severity]}`}
              />
              <span className="flex-1">
                <span className="block text-sm font-medium text-text">
                  {it.label}
                </span>
                <span className="block text-xs text-text-muted">
                  {it.count} {it.count === 1 ? "work" : "works"}
                </span>
              </span>
              <Pill tone={TONE[it.severity]}>{it.severity}</Pill>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 rounded border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Selected
          </p>
          <p className="mt-1 text-base font-semibold text-text">
            {selected.label}{" "}
            <span className="text-sm font-normal text-text-muted">
              · detected in {selected.count}{" "}
              {selected.count === 1 ? "work" : "works"}
            </span>
          </p>
          <p className="mt-3 text-sm text-text">
            <em className="not-italic font-medium">How to fix:</em>{" "}
            {selected.howToFix}
          </p>
          <p className="mt-2 text-xs text-text-muted">
            External sources used only for validation. No automatic changes are
            applied.
          </p>
        </div>
      )}
    </div>
  );
}
