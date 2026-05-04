"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";
import { apiFetcher } from "@/lib/api";

type Dashboard = {
  // Company
  companyName: string;
  orgnr: string;
  activePlan: string;
  monthlyFee: number;

  // Usage
  validationsThisMonth: number;
  pendingCorrections: number;

  // Billing
  currentPeriod: string;
  billingAmount: number;
  billingStatus: string;

  // Existing widgets
  pendingScans: number;
  completedReports: number;
  pendingWorksheets: number;
  totalScans: number;
  lastScan: string;
  avgHealth: number;
};

const fmtSEK = (n: number) => n.toLocaleString("sv-SE") + " SEK";

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
          <p className="text-sm text-kh-red">Kunde inte ladda data.</p>
        </Card>
      </>
    );
  }

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

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card title="Företag">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">Aktiv plan</dt>
              <dd className="font-medium text-text">{data.activePlan}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Månadsavgift</dt>
              <dd className="font-medium text-text">{fmtSEK(data.monthlyFee)}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Användning">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">Valideringar denna månad</dt>
              <dd className="font-medium text-text">{data.validationsThisMonth}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Väntar korrigering</dt>
              <dd className="font-medium text-text">{data.pendingCorrections}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Fakturering">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">Aktuell period</dt>
              <dd className="font-medium text-text">{data.currentPeriod}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Belopp</dt>
              <dd className="font-medium text-text">{fmtSEK(data.billingAmount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Status</dt>
              <dd>
                <Pill tone={data.billingStatus === "Not invoiced" ? "yellow" : "green"}>
                  {data.billingStatus}
                </Pill>
              </dd>
            </div>
          </dl>
        </Card>
      </section>
    </>
  );
}
