"use client";

import useSWR from "swr";
import { Card } from "@/app/components/Card";

type Item = { category: string; count: number };

import { apiFetcher } from "@/lib/api";

export default function CommonIssuesPage() {
  const { data, error, isLoading } = useSWR<Item[]>(
    "/api/kataloghub/analytics/issues",
    apiFetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda statistik.</p>;

  const max = data.reduce((m, i) => Math.max(m, i.count), 0) || 1;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold uppercase">Vanligaste problemen</h1>
        <p className="mt-1 text-sm text-text-muted">
          Återkommande metadataproblem över alla skanningar.
        </p>
      </header>

      <Card>
        <ul className="space-y-3">
          {data.length === 0 ? (
            <li className="text-sm text-text-muted">Ingen data ännu.</li>
          ) : (
            data.map((item) => {
              const pct = Math.round((100 * item.count) / max);
              return (
                <li key={item.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <strong className="text-text">{item.category}</strong>
                    <span className="font-mono text-text-muted">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-border">
                    <div className="h-2 rounded-full bg-kh-green" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </Card>
    </>
  );
}
