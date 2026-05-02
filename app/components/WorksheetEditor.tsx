"use client";

import { useMemo, useState } from "react";
import type { WorksheetRow, WorksheetDecision } from "@/lib/types";

const DECISIONS: WorksheetDecision[] = ["accept", "reject", "edit"];

function csvEscape(v: unknown) {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function rowsToCsv(rows: WorksheetRow[]) {
  const header = "issue_id,work_id,field,original,suggested,decision,notes";
  const body = rows
    .map((r) =>
      [
        r.issue_id,
        r.work_id,
        r.field,
        r.original,
        r.suggested,
        r.decision ?? "",
        r.notes ?? "",
      ]
        .map(csvEscape)
        .join(","),
    )
    .join("\n");
  return `${header}\n${body}\n`;
}

export function WorksheetEditor({
  catalogId,
  initialRows,
}: {
  catalogId: string;
  initialRows: WorksheetRow[];
}) {
  const [rows, setRows] = useState<WorksheetRow[]>(initialRows);

  const stats = useMemo(() => {
    const total = rows.length;
    const decided = rows.filter((r) => r.decision != null).length;
    const accept = rows.filter((r) => r.decision === "accept").length;
    const reject = rows.filter((r) => r.decision === "reject").length;
    const edit = rows.filter((r) => r.decision === "edit").length;
    return { total, decided, accept, reject, edit, ready: decided === total };
  }, [rows]);

  function setDecision(idx: number, decision: WorksheetDecision) {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, decision } : r)),
    );
  }
  function setNotes(idx: number, notes: string) {
    setRows((prev) =>
      prev.map((r, i) =>
        i === idx ? { ...r, notes: notes || null } : r,
      ),
    );
  }
  function acceptAll() {
    setRows((prev) => prev.map((r) => ({ ...r, decision: "accept" })));
  }
  function rejectAll() {
    setRows((prev) => prev.map((r) => ({ ...r, decision: "reject" })));
  }
  function clearAll() {
    setRows((prev) => prev.map((r) => ({ ...r, decision: null })));
  }

  function downloadCsv() {
    const blob = new Blob([rowsToCsv(rows)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kataloghub-worksheet-${catalogId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={acceptAll}
          className="rounded border border-border bg-bg px-3 py-1.5 text-sm font-medium hover:border-text-muted"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={rejectAll}
          className="rounded border border-border bg-bg px-3 py-1.5 text-sm font-medium hover:border-text-muted"
        >
          Reject all
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="rounded border border-border bg-bg px-3 py-1.5 text-sm font-medium text-text-muted hover:border-text-muted"
        >
          Clear decisions
        </button>

        <div className="ml-auto flex items-center gap-3 text-xs text-text-muted">
          <span>
            <strong className="text-text">{stats.decided}</strong> /{" "}
            {stats.total} decided
          </span>
          <span>
            ✓ {stats.accept} · ✕ {stats.reject} · ✎ {stats.edit}
          </span>
        </div>

        <button
          type="button"
          disabled={!stats.ready}
          onClick={downloadCsv}
          className="rounded bg-kh-orange px-4 py-1.5 text-sm font-semibold text-white hover:bg-kh-orange-dark disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
        >
          Export worksheet (CSV)
        </button>
      </div>

      {!stats.ready && (
        <p className="rounded border border-kh-yellow bg-kh-yellow/10 p-2 text-xs text-text">
          Cannot export until every issue has a decision. {stats.total - stats.decided} remaining.
        </p>
      )}

      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-3 py-2 font-semibold">issue_id</th>
              <th className="px-3 py-2 font-semibold">work_id</th>
              <th className="px-3 py-2 font-semibold">field</th>
              <th className="px-3 py-2 font-semibold">original</th>
              <th className="px-3 py-2 font-semibold">suggested</th>
              <th className="px-3 py-2 font-semibold">decision</th>
              <th className="px-3 py-2 font-semibold">notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.issue_id} className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs">{r.issue_id}</td>
                <td className="px-3 py-2 font-mono text-xs text-kh-green">
                  {r.work_id}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-kh-green">
                  {r.field}
                </td>
                <td className="px-3 py-2 text-text-muted">
                  {r.original || "—"}
                </td>
                <td className="px-3 py-2">{r.suggested}</td>
                <td className="px-3 py-2">
                  <select
                    value={r.decision ?? ""}
                    onChange={(e) =>
                      setDecision(
                        i,
                        (e.target.value || null) as WorksheetDecision,
                      )
                    }
                    className="w-full rounded border border-border bg-bg px-2 py-1 text-sm focus:border-kh-green focus:outline-none"
                  >
                    <option value="">— choose —</option>
                    {DECISIONS.map((d) => (
                      <option key={d} value={d!}>
                        {d}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={r.notes ?? ""}
                    onChange={(e) => setNotes(i, e.target.value)}
                    placeholder="Optional"
                    className="w-full rounded border border-border bg-bg px-2 py-1 text-sm focus:border-kh-green focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
