"use client";

import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Card } from "@/app/components/Card";
import { apiFetcher, apiUrl } from "@/lib/api";
import { StepIndicator, PIPELINE_STEPS } from "@/app/components/StepIndicator";

type WorksheetRow = {
  issue_id: string;
  work_id: string;
  field: string;
  original_value: string;
  suggested_value: string;
  decision?: string;
  notes?: string;
};

const HEYROYA_UPLOAD_URL =
  process.env.NEXT_PUBLIC_HEYROYA_UPLOAD_URL || "https://upload.heyroya.se/";

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
  if (error || !data)
    return <p className="text-sm text-kh-red">Kunde inte ladda arbetsbladet.</p>;

  return (
    <>
      <StepIndicator steps={PIPELINE_STEPS} current={4} />

      <header className="mb-6">
        <h1 className="text-3xl font-bold uppercase">Arbetsblad</h1>
        <p className="mt-1 text-sm text-text-muted">
          Detta är underlaget som publicisten ska arbeta med.
        </p>
        <p className="mt-1 font-mono text-xs text-text-muted">Scan-ID: {id}</p>
      </header>

      <Card title="Så fyller du i arbetsbladet">
        <ul className="space-y-1.5 text-sm text-text">
          <li>· Behåll kolumnnamn och ordning exakt som de är.</li>
          <li>
            · Fyll endast i kolumnen{" "}
            <code className="font-mono text-xs">decision</code> och vid behov{" "}
            <code className="font-mono text-xs">notes</code>.
          </li>
          <li>
            · Godkända värden: <code className="font-mono">approve</code>,{" "}
            <code className="font-mono">reject</code>,{" "}
            <code className="font-mono">defer</code>.
          </li>
          <li>· Spara som CSV (kommaavgränsad) — inte XLSX.</li>
          <li>
            · Skicka tillbaka till HeyRoya genom att ladda upp originalfilen +
            detta arbetsblad på{" "}
            <a
              href={HEYROYA_UPLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-kh-orange-dark underline hover:text-kh-orange"
            >
              upload.heyroya.se
            </a>
            .
          </li>
        </ul>
        <p className="mt-3 text-[11px] text-text-muted">
          Numeriska identifierare (writer_ipi, iswc, isrc) genereras med
          inledande apostrof <code className="font-mono">&apos;</code> så Excel
          inte konverterar dem till vetenskapligt format.
        </p>
        <p className="mt-2">
          <Link
            href="/kataloghub/how-to"
            className="text-sm font-medium text-kh-orange-dark underline hover:text-kh-orange"
          >
            Läs hela vägledningen →
          </Link>
        </p>
      </Card>

      <Card title={`Avvikelser (${data.length} rader)`} className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-muted">
                <th className="py-2 pr-3 font-semibold">issue_id</th>
                <th className="py-2 pr-3 font-semibold">work_id</th>
                <th className="py-2 pr-3 font-semibold">field</th>
                <th className="py-2 pr-3 font-semibold">original_value</th>
                <th className="py-2 pr-3 font-semibold">suggested_value</th>
                <th className="py-2 pr-3 font-semibold">decision</th>
                <th className="py-2 font-semibold">notes</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-kh-green">
                    Inga avvikelser identifierade.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={row.issue_id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-2 pr-3 font-mono text-xs text-text-muted">{row.issue_id}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-kh-green">{row.work_id}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-text">{row.field}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-text-muted">{row.original_value || "—"}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-text">{row.suggested_value}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-text-muted">{row.decision || "—"}</td>
                    <td className="py-2 font-mono text-xs text-text-muted">{row.notes || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={apiUrl(`/api/kataloghub/worksheet/${id}/download`)}
            className="rounded-full bg-kh-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kh-orange-dark"
          >
            Ladda ner arbetsblad (CSV)
          </a>
          <a
            href={HEYROYA_UPLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
          >
            Öppna HeyRoya för att ladda upp filer →
          </a>
          <Link
            href={`/kataloghub/scan/${id}`}
            className="rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
          >
            Tillbaka till scan
          </Link>
        </div>

        <p className="mt-3 text-xs text-text-muted">
          Du skickar arbetsbladet till HeyRoya genom att ladda upp originalfilen
          och den korrigerade filen på{" "}
          <a
            href={HEYROYA_UPLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-kh-orange-dark underline hover:text-kh-orange"
          >
            upload.heyroya.se
          </a>
          .
        </p>
      </Card>
    </>
  );
}
