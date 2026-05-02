"use client";

import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Card } from "@/app/components/Card";

type WorksheetRow = {
  issue_id: string;
  work_id: string;
  field: string;
  original: string;
  suggested: string;
};

import { apiFetcher, apiUrl } from "@/lib/api";

const HEYROYA_URL =
  process.env.NEXT_PUBLIC_HEYROYA_URL || "https://heyroya.se/queue";

export default function WorksheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, error, isLoading } = useSWR<WorksheetRow[]>(
    `/api/kataloghub/worksheet/${id}`,
    apiFetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda kalkylblad.</p>;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Arbetsblad</h1>
        <p className="mt-1 text-sm text-text-muted">
          Detta är underlaget som publicisten ska arbeta med.
        </p>
        <p className="mt-1 font-mono text-xs text-text-muted">Scan-ID: {id}</p>
      </header>

      <Card title={`Avvikelser (${data.length} rader)`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-muted">
                <th className="py-2 pr-3 font-semibold">issue_id</th>
                <th className="py-2 pr-3 font-semibold">work_id</th>
                <th className="py-2 pr-3 font-semibold">fält</th>
                <th className="py-2 pr-3 font-semibold">original</th>
                <th className="py-2 font-semibold">förslag</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-kh-green">
                    Inga avvikelser identifierade.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.issue_id} className="border-b border-border last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs text-text-muted">{row.issue_id}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-kh-green">{row.work_id}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-text">{row.field}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-text-muted">{row.original || "—"}</td>
                    <td className="py-2 font-mono text-xs text-text">{row.suggested}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={apiUrl(`/api/kataloghub/worksheet/${id}/download`)}
            className="rounded bg-kh-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kh-orange-dark"
          >
            Ladda ner kalkylblad (CSV)
          </a>
          <a
            href={`${HEYROYA_URL}?catalog=${encodeURIComponent(id)}`}
            className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
          >
            Skicka till HeyRoya →
          </a>
          <Link
            href={`/kataloghub/scan/${id}`}
            className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
          >
            Tillbaka till scan
          </Link>
        </div>
      </Card>
    </>
  );
}
