"use client";

import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Card } from "@/app/components/Card";

type Catalog = {
  id: string;
  name: string;
  scans: { id: string; timestamp: string; score: number }[];
};

import { apiFetcher } from "@/lib/api";

export default function CatalogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, error, isLoading } = useSWR<Catalog>(
    `/api/kataloghub/catalogs/${id}`,
    apiFetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda katalogen.</p>;

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{data.name}</h1>
          <p className="mt-1 font-mono text-xs text-text-muted">{data.id}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/kataloghub/upload?catalog=${encodeURIComponent(data.id)}`}
            className="rounded bg-kh-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kh-orange-dark"
          >
            Ladda upp ny skanning
          </Link>
          <Link
            href={`/kataloghub/catalogs/${data.id}/edit`}
            className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
          >
            Redigera
          </Link>
          <Link
            href={`/kataloghub/catalogs/${data.id}/transfer`}
            className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
          >
            Överför
          </Link>
        </div>
      </header>

      <Card title={`Skanningar (${data.scans.length})`}>
        {data.scans.length === 0 ? (
          <p className="text-sm text-text-muted">Inga skanningar än.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-muted">
                <th className="py-2 pr-3 font-semibold">Tidpunkt</th>
                <th className="py-2 pr-3 font-semibold">Hälsopoäng</th>
                <th className="py-2 pr-3 font-semibold">Scan-ID</th>
                <th className="py-2 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {data.scans.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="py-2 pr-3 font-mono text-xs text-text">{s.timestamp}</td>
                  <td className="py-2 pr-3 font-semibold text-text">{s.score}</td>
                  <td className="py-2 pr-3 font-mono text-xs text-kh-green">{s.id}</td>
                  <td className="py-2">
                    <Link
                      href={`/kataloghub/scan/${s.id}`}
                      className="inline-block rounded border border-border bg-bg px-3 py-1 text-xs font-medium text-text hover:border-text-muted"
                    >
                      Visa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
