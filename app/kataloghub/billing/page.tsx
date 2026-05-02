"use client";

import useSWR from "swr";
import { Card } from "@/app/components/Card";

type Billing = {
  pricePerScan: number;
  totalScans: number;
  history: { month: string; scans: number; total: number }[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function fmtSEK(n: number) {
  return n.toLocaleString("sv-SE") + " SEK";
}

export default function BillingPage() {
  const { data, error, isLoading } = useSWR<Billing>(
    "/api/kataloghub/billing",
    fetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda fakturering.</p>;

  const total = data.pricePerScan * data.totalScans;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Fakturering</h1>
        <p className="mt-1 text-sm text-text-muted">Pris per skanning och historik.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Pris per skanning">
          <p className="text-2xl font-semibold text-text">{fmtSEK(data.pricePerScan)}</p>
        </Card>
        <Card title="Antal skanningar">
          <p className="text-2xl font-semibold text-text">{data.totalScans}</p>
        </Card>
        <Card title="Totalt">
          <p className="text-2xl font-semibold text-text">{fmtSEK(total)}</p>
        </Card>
      </section>

      <section className="mt-6">
        <Card title="Historik">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-muted">
                  <th className="py-2 pr-3 font-semibold">Månad</th>
                  <th className="py-2 pr-3 font-semibold">Skanningar</th>
                  <th className="py-2 font-semibold text-right">Belopp</th>
                </tr>
              </thead>
              <tbody>
                {data.history.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-text-muted">
                      Ingen historik ännu.
                    </td>
                  </tr>
                ) : (
                  data.history.map((h) => (
                    <tr key={h.month} className="border-b border-border last:border-0">
                      <td className="py-2 pr-3 font-mono text-xs text-text">{h.month}</td>
                      <td className="py-2 pr-3 text-text">{h.scans}</td>
                      <td className="py-2 text-right font-mono text-xs text-text">{fmtSEK(h.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </>
  );
}
