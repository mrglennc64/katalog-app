import type { IssueType } from "@/lib/types";
import { Pill } from "./Pill";

const TONE = {
  blocking: "red" as const,
  resolvable: "yellow" as const,
  residual: "neutral" as const,
  clean: "green" as const,
};

export function HowToFix({ issue }: { issue: IssueType }) {
  return (
    <li className="border-b border-border py-3 last:border-0">
      <div className="flex items-center gap-2">
        <strong className="text-text">{issue.label}</strong>
        <Pill tone={TONE[issue.severity]}>
          {issue.count} {issue.count === 1 ? "work" : "works"}
        </Pill>
      </div>
      <p className="mt-1 text-sm text-text-muted">
        <em className="not-italic font-medium text-text">How to fix:</em>{" "}
        {issue.howToFix}
      </p>
    </li>
  );
}
