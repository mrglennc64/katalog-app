"use client";

import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";

type ScanData = {
  scan_id: string;
  score: number;
  timestamp: string;
  issues: { clean: number; resolvable: number; blocking: number };
  categories: { name: string; count: number }[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ScanResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, error, isLoading } = useSWR<ScanData>(
    `/api/kataloghub/scan/${id}`,
    fetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda scan-resultat.</p>;

  const scoreTone: "green" | "yellow" | "red" =
    data.score >= 90 ? "green" : data.score >= 70 ? "yellow" : "red";

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Scan-resultat</h1>
        <p className="mt-1 font-mono text-xs text-text-muted">
          Scan-ID: {data.scan_id} · Skapad {data.timestamp}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Hälsopoäng">
          <p className="text-4xl font-semibold text-text">{data.score}</p>
          <p className="mt-1 text-xs text-text-muted">av 100</p>
          <div className="mt-2">
            <Pill tone={scoreTone}>
              {scoreTone === "green" ? "Bra" : scoreTone === "yellow" ? "Behöver åtgärd" : "Kritisk"}
            </Pill>
          </div>
        </Card>

        <Card title="Allvarlighetsnivåer">
          <ul className="space-y-1.5 text-sm text-text">
            <li className="flex items-center justify-between">
              <span>OK</span>
              <Pill tone="green">{data.issues.clean}</Pill>
            </li>
            <li className="flex items-center justify-between">
              <span>Åtgärdbara</span>
              <Pill tone="yellow">{data.issues.resolvable}</Pill>
            </li>
            <li className="flex items-center justify-between">
              <span>Blockerande</span>
              <Pill tone={data.issues.blocking === 0 ? "green" : "red"}>{data.issues.blocking}</Pill>
            </li>
          </ul>
        </Card>

        <Card title="Kategorier" className="md:col-span-2">
          {data.categories.length === 0 ? (
            <p className="text-sm text-text-muted">Inga avvikelser.</p>
          ) : (
            <ul className="space-y-1 text-sm text-text">
              {data.categories.map((c) => (
                <li key={c.name} className="flex items-center justify-between border-b border-border pb-1 last:border-0 last:pb-0">
                  <span>{c.name}</span>
                  <span className="font-mono text-text-muted">{c.count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="mt-6">
        <Card title="Nästa steg">
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/kataloghub/health-report/${id}`}
              className="rounded bg-kh-green px-4 py-2 text-sm font-semibold text-white hover:bg-kh-green-dark"
            >
              Visa hälsorapport
            </Link>
            <Link
              href={`/kataloghub/worksheet/${id}`}
              className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
            >
              Visa kalkylblad
            </Link>
            <a
              href={`/api/kataloghub/worksheet/${id}/download`}
              className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
            >
              Ladda ner kalkylblad (CSV)
            </a>
          </div>
        </Card>
      </section>
    </>
  );
}
