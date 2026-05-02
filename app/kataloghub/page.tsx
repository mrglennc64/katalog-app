"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";

type Dashboard = {
  pendingScans: number;
  completedReports: number;
  pendingWorksheets: number;
  totalScans: number;
  lastScan: string;
  avgHealth: number;
  pricePerScan: number;
  companyName: string;
  orgnr: string;
};

import { apiFetcher } from "@/lib/api";

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR<Dashboard>(
    "/api/kataloghub/dashboard",
    apiFetcher,
  );

  if (isLoading) {
    return (
      <header className="mb-6">
        <h1 className="text-3xl font-bold uppercase">Välkommen</h1>
        <p className="mt-1 text-sm text-text-muted">Laddar…</p>
      </header>
    );
  }

  if (error || !data) {
    return (
      <>
        <header className="mb-6">
          <h1 className="text-3xl font-bold uppercase">Välkommen</h1>
          <p className="mt-1 text-sm text-text-muted">
            Filbaserad validering av katalogmetadata. Ingen systemåtkomst. Ingen ingestion.
          </p>
        </header>
        <Card>
          <p className="text-sm text-kh-red">
            Kunde inte ladda data.
          </p>
        </Card>
      </>
    );
  }

  const billingTotal = data.pricePerScan * data.totalScans;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold uppercase">Välkommen</h1>
        <p className="mt-1 text-sm text-text-muted">
          {data.companyName} · {data.orgnr}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Kom igång">
          <ol className="list-decimal pl-5 text-sm text-text">
            <li className="py-0.5">
              <Link href="/kataloghub/upload" className="text-kh-green underline hover:text-kh-green-dark">
                Ladda upp katalog
              </Link>
            </li>
            <li className="py-0.5">Kör skanning</li>
            <li className="py-0.5">Ladda ner arbetsblad</li>
            <li className="py-0.5">Skicka arbetsblad till HeyRoya</li>
          </ol>
        </Card>

        <Card title="Att göra">
          <ul className="space-y-1 text-sm text-text">
            <li>• {data.pendingScans} skanningar väntar</li>
            <li>• {data.pendingWorksheets} arbetsblad väntar bekräftelse</li>
            <li>• {data.completedReports} rapporter klara</li>
          </ul>
        </Card>

        <Card title="Insikter">
          <ul className="space-y-1 text-sm text-text">
            <li>Totala skanningar: {data.totalScans}</li>
            <li>Senaste skanning: {data.lastScan}</li>
          </ul>
        </Card>

        <Card title="Status">
          <p className="mb-2 text-sm text-text">
            Genomsnittlig hälsa:{" "}
            <strong className="text-base">{data.avgHealth} / 100</strong>
          </p>
          <div className="space-y-1.5">
            <div>
              <Pill tone={data.avgHealth >= 90 ? "green" : data.avgHealth >= 70 ? "yellow" : "red"}>
                {data.avgHealth >= 90 ? "Bra" : data.avgHealth >= 70 ? "Behöver åtgärd" : "Kritisk"}
              </Pill>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title="Företaget">
          <ul className="space-y-1 text-sm text-text">
            <li>Totala skanningar: {data.totalScans}</li>
            <li>Väntar korrigering: {data.pendingWorksheets}</li>
          </ul>
        </Card>

        <Card title="Fakturering">
          <p className="text-sm text-text-muted">
            Pris per skanning: <strong className="text-text">{data.pricePerScan} SEK</strong>
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Antal skanningar: <strong className="text-text">{data.totalScans}</strong>
          </p>
          <p className="mt-2 text-base font-semibold text-text">
            Total: {billingTotal.toLocaleString("sv-SE")} SEK
          </p>
        </Card>
      </section>
    </>
  );
}
