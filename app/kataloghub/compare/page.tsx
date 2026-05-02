"use client";

import { useState } from "react";
import { Card } from "@/app/components/Card";
import { apiFetch } from "@/lib/api";

type DiffRow = {
  work_id: string;
  field: string;
  before: string;
  after: string;
};

type DiffResult = {
  a: string;
  b: string;
  rows: DiffRow[];
};

export default function CompareScansPage() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function runDiff() {
    setErrorMsg(null);
    setDiff(null);
    if (!a || !b) {
      setErrorMsg("Ange båda scan-ID:n.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch("/api/kataloghub/compare", {
        method: "POST",
        body: JSON.stringify({ a, b }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrorMsg(j.error || `HTTP ${res.status}`);
        return;
      }
      setDiff(await res.json());
    } catch (err) {
      setErrorMsg(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Jämför två skanningar</h1>
        <p className="mt-1 text-sm text-text-muted">
          Visa skillnader mellan två scan-ID:n.
        </p>
      </header>

      <Card>
        <div className="grid gap-3 sm:grid-cols-3 sm:items-end">
          <label className="text-sm">
            <span className="block text-xs uppercase tracking-wide text-text-muted">Scan A</span>
            <input
              className="mt-1 w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text outline-none focus:border-text-muted"
              placeholder="HR-..."
              value={a}
              onChange={(e) => setA(e.target.value.trim())}
            />
          </label>
          <label className="text-sm">
            <span className="block text-xs uppercase tracking-wide text-text-muted">Scan B</span>
            <input
              className="mt-1 w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text outline-none focus:border-text-muted"
              placeholder="HR-..."
              value={b}
              onChange={(e) => setB(e.target.value.trim())}
            />
          </label>
          <button
            type="button"
            onClick={runDiff}
            disabled={loading}
            className="rounded bg-kh-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kh-orange-dark disabled:cursor-not-allowed disabled:bg-border"
          >
            {loading ? "Jämför…" : "Jämför"}
          </button>
        </div>

        {errorMsg && (
          <p className="mt-3 rounded border border-kh-red/40 bg-kh-red/5 px-3 py-2 text-sm text-kh-red">
            {errorMsg}
          </p>
        )}
      </Card>

      {diff && (
        <Card title={`Skillnader (${diff.rows.length} rader)`} className="mt-4">
          <p className="mb-2 font-mono text-xs text-text-muted">
            {diff.a} → {diff.b}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-muted">
                  <th className="py-2 pr-3 font-semibold">work_id</th>
                  <th className="py-2 pr-3 font-semibold">fält</th>
                  <th className="py-2 pr-3 font-semibold">före</th>
                  <th className="py-2 font-semibold">efter</th>
                </tr>
              </thead>
              <tbody>
                {diff.rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-kh-green">
                      Inga skillnader.
                    </td>
                  </tr>
                ) : (
                  diff.rows.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-2 pr-3 font-mono text-xs text-kh-green">{row.work_id}</td>
                      <td className="py-2 pr-3 font-mono text-xs text-text">{row.field}</td>
                      <td className="py-2 pr-3 font-mono text-xs text-text-muted line-through">
                        {row.before || "—"}
                      </td>
                      <td className="py-2 font-mono text-xs text-kh-green">{row.after || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
