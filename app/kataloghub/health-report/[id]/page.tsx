"use client";

import { use, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Card } from "@/app/components/Card";

type Row = {
  work_id: string;
  field: string;
  value: string;
  status: "ok" | "invalid" | "missing" | string;
};

type HealthReport = {
  before: Row[];
  after: Row[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function statusClass(s: string) {
  if (s === "ok") return "border-kh-green/40 bg-kh-green/10 text-kh-green";
  if (s === "missing") return "border-kh-yellow/40 bg-kh-yellow/10 text-[#7a5a10]";
  return "border-kh-red/40 bg-kh-red/10 text-kh-red";
}

export default function HealthReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tab, setTab] = useState<"before" | "after">("before");
  const { data, error, isLoading } = useSWR<HealthReport>(
    `/api/kataloghub/health-report/${id}`,
    fetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda hälsorapporten.</p>;

  const rows = data[tab];

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Hälsorapport</h1>
        <p className="mt-1 font-mono text-xs text-text-muted">Scan-ID: {id}</p>
      </header>

      <Card title="Före / Efter">
        <div className="mb-4 flex gap-2 border-b border-border">
          <button
            type="button"
            onClick={() => setTab("before")}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === "before"
                ? "border-kh-green text-kh-green"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Före korrigering
          </button>
          <button
            type="button"
            onClick={() => setTab("after")}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === "after"
                ? "border-kh-green text-kh-green"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Efter korrigering
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-muted">
                <th className="py-2 pr-3 font-semibold">work_id</th>
                <th className="py-2 pr-3 font-semibold">fält</th>
                <th className="py-2 pr-3 font-semibold">värde</th>
                <th className="py-2 font-semibold">status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-2 pr-3 font-mono text-xs text-kh-green">{row.work_id}</td>
                  <td className="py-2 pr-3 font-mono text-xs text-text">{row.field}</td>
                  <td className="py-2 pr-3 font-mono text-xs text-text-muted">{row.value || "—"}</td>
                  <td className="py-2">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${statusClass(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <section className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/kataloghub/scan/${id}`}
          className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
        >
          Tillbaka till scan
        </Link>
        <Link
          href={`/kataloghub/worksheet/${id}`}
          className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
        >
          Visa kalkylblad
        </Link>
      </section>
    </>
  );
}
