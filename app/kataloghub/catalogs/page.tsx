"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";

type Catalog = {
  id: string;
  name: string;
  lastScan: string;
  lastScanId: string;
  score: number;
  blocking: number;
  resolvable: number;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CatalogListPage() {
  const { data, error, isLoading } = useSWR<Catalog[]>(
    "/api/kataloghub/catalogs",
    fetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda kataloger.</p>;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Kataloger</h1>
        <p className="mt-1 text-sm text-text-muted">
          Översikt över alla kataloger och senaste skanning.
        </p>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-muted">
                <th className="py-2 pr-3 font-semibold">Katalog</th>
                <th className="py-2 pr-3 font-semibold">Senaste skanning</th>
                <th className="py-2 pr-3 font-semibold">Hälsopoäng</th>
                <th className="py-2 pr-3 font-semibold">Blockerande</th>
                <th className="py-2 pr-3 font-semibold">Åtgärdbara</th>
                <th className="py-2 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-text-muted">
                    Inga kataloger än.
                  </td>
                </tr>
              ) : (
                data.map((cat) => {
                  const tone: "green" | "yellow" | "red" =
                    cat.score >= 90 ? "green" : cat.score >= 70 ? "yellow" : "red";
                  return (
                    <tr key={cat.id} className="border-b border-border last:border-0">
                      <td className="py-2 pr-3 font-medium text-text">{cat.name}</td>
                      <td className="py-2 pr-3 font-mono text-xs text-text-muted">{cat.lastScan}</td>
                      <td className="py-2 pr-3">
                        <span className="font-semibold text-text">{cat.score}</span>{" "}
                        <Pill tone={tone}>
                          {tone === "green" ? "Bra" : tone === "yellow" ? "Åtgärd" : "Kritisk"}
                        </Pill>
                      </td>
                      <td className="py-2 pr-3">
                        <Pill tone={cat.blocking === 0 ? "green" : "red"}>{cat.blocking}</Pill>
                      </td>
                      <td className="py-2 pr-3">
                        <Pill tone={cat.resolvable === 0 ? "green" : "yellow"}>{cat.resolvable}</Pill>
                      </td>
                      <td className="py-2">
                        <Link
                          href={`/kataloghub/scan/${cat.lastScanId}`}
                          className="inline-block rounded border border-border bg-bg px-3 py-1 text-xs font-medium text-text hover:border-text-muted"
                        >
                          Visa
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
