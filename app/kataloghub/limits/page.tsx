"use client";

import useSWR from "swr";
import { Card } from "@/app/components/Card";

type Limits = {
  plan: string;
  limit: number;
  used: number;
  period?: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ScanLimitsPage() {
  const { data, error, isLoading } = useSWR<Limits>(
    "/api/kataloghub/limits",
    fetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda gränser.</p>;

  const remaining = Math.max(0, data.limit - data.used);
  const pctUsed = data.limit > 0 ? Math.min(100, Math.round((100 * data.used) / data.limit)) : 0;
  const barColor = pctUsed >= 100 ? "bg-kh-red" : pctUsed >= 80 ? "bg-kh-yellow" : "bg-kh-green";

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Skanningsgräns</h1>
        <p className="mt-1 text-sm text-text-muted">
          Plan, gräns och användning för perioden.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <Card title="Plan">
          <p className="text-xl font-semibold text-text">{data.plan}</p>
          {data.period && <p className="mt-1 text-xs text-text-muted">Period: {data.period}</p>}
        </Card>
        <Card title="Gräns">
          <p className="text-xl font-semibold text-text">{data.limit}</p>
        </Card>
        <Card title="Använda">
          <p className="text-xl font-semibold text-text">{data.used}</p>
        </Card>
        <Card title="Kvar">
          <p className="text-xl font-semibold text-text">{remaining}</p>
        </Card>
      </section>

      <section className="mt-4">
        <Card title="Användning">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-text-muted">{data.used} / {data.limit}</span>
            <span className="font-mono text-text-muted">{pctUsed}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-border">
            <div className={`h-3 rounded-full ${barColor}`} style={{ width: `${pctUsed}%` }} />
          </div>
          {remaining <= 0 && (
            <div className="mt-3 rounded border border-kh-red/40 bg-kh-red/5 p-3 text-sm text-kh-red">
              Du har nått din skanningsgräns. Uppgradera din plan för att fortsätta.
            </div>
          )}
        </Card>
      </section>
    </>
  );
}
