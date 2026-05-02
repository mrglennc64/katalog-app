"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";

type Scan = {
  id: string;
  timestamp: string;
  catalogName: string;
  score: number;
  blocking: number;
  resolvable: number;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ScanHistoryPage() {
  const { data, error, isLoading } = useSWR<Scan[]>(
    "/api/kataloghub/scans",
    fetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda historik.</p>;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Skanningshistorik</h1>
        <p className="mt-1 text-sm text-text-muted">
          Tidslinje över genomförda skanningar.
        </p>
      </header>

      <Card>
        {data.length === 0 ? (
          <p className="text-sm text-text-muted">Inga skanningar än.</p>
        ) : (
          <ol className="relative space-y-4 border-l-2 border-border pl-5">
            {data.map((scan) => {
              const tone: "green" | "yellow" | "red" =
                scan.score >= 90 ? "green" : scan.score >= 70 ? "yellow" : "red";
              return (
                <li key={scan.id} className="relative">
                  <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-kh-green" />
                  <div className="font-mono text-xs text-text-muted">{scan.timestamp}</div>
                  <div className="mt-1 grid gap-1 text-sm text-text sm:grid-cols-2">
                    <div>
                      <span className="text-text-muted">Katalog:</span>{" "}
                      <strong>{scan.catalogName}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted">Hälsopoäng:</span>
                      <strong>{scan.score}</strong>
                      <Pill tone={tone}>
                        {tone === "green" ? "Bra" : tone === "yellow" ? "Behöver åtgärd" : "Kritisk"}
                      </Pill>
                    </div>
                    <div>
                      <span className="text-text-muted">Blockerande:</span>{" "}
                      <Pill tone={scan.blocking === 0 ? "green" : "red"}>{scan.blocking}</Pill>
                    </div>
                    <div>
                      <span className="text-text-muted">Åtgärdbara:</span>{" "}
                      <Pill tone={scan.resolvable === 0 ? "green" : "yellow"}>{scan.resolvable}</Pill>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link
                      href={`/kataloghub/scan/${scan.id}`}
                      className="inline-block rounded border border-border bg-bg px-3 py-1 text-xs font-medium text-text hover:border-text-muted"
                    >
                      Visa resultat
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Card>
    </>
  );
}
