import { Card } from "./Card";

export function ValidationVsCorrection() {
  return (
    <Card title="Validation vs Correction">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded border border-border bg-surface p-3">
          <h3 className="mb-2 text-sm font-semibold text-text">
            Kataloghub · Validation
          </h3>
          <ul className="space-y-1 text-sm text-text-muted">
            <li>Automated</li>
            <li>File-based</li>
            <li>No changes</li>
            <li>Monthly license</li>
          </ul>
        </div>
        <div className="rounded border border-border bg-surface p-3">
          <h3 className="mb-2 text-sm font-semibold text-text">
            HeyRoya · Correction
          </h3>
          <ul className="space-y-1 text-sm text-text-muted">
            <li>Manual</li>
            <li>Verified</li>
            <li>Per-work fee</li>
            <li>Publisher-confirmed</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
