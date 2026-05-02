"use client";

import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Card } from "@/app/components/Card";
import { KataloghubFixGuidance } from "@/app/components/KataloghubFixGuidance";
import { severityClass } from "@/lib/kataloghub/severity";

type CategoryRow = {
  work_id: string;
  field: string;
  value: string;
  status: string;
};

type CategoryData = {
  categoryName: string;
  description: string;
  rows: CategoryRow[];
};

import { apiFetcher } from "@/lib/api";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = use(params);
  const { data, error, isLoading } = useSWR<CategoryData>(
    `/api/kataloghub/scan/${id}/category/${slug}`,
    apiFetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda kategori.</p>;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Kategori: {data.categoryName}</h1>
        {data.description && (
          <p className="mt-1 text-sm text-text-muted">{data.description}</p>
        )}
        <p className="mt-1 font-mono text-xs text-text-muted">Scan-ID: {id}</p>
      </header>

      <section className="mb-4">
        <KataloghubFixGuidance category={slug} />
      </section>

      <Card title={`Rader (${data.rows.length})`}>
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
              {data.rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-kh-green">
                    Inga rader i denna kategori.
                  </td>
                </tr>
              ) : (
                data.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs text-kh-green">{row.work_id}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-text">{row.field}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-text-muted">{row.value || "—"}</td>
                    <td className="py-2">
                      <span className={severityClass(row.status)}>{row.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <section className="mt-6">
        <Link
          href={`/kataloghub/scan/${id}`}
          className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
        >
          Tillbaka till scan-resultat
        </Link>
      </section>
    </>
  );
}
