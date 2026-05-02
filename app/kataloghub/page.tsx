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

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR<Dashboard>(
    "/api/kataloghub/dashboard",
    fetcher,
  );

  if (isLoading) {
    return (
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="mt-1 text-sm text-text-muted">Laddar…</p>
      </header>
    );
  }

  if (error || !data) {
    return (
      <>
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="mt-1 text-sm text-text-muted">
            File-based metadata validation. No system access. No ingestion.
          </p>
        </header>
        <Card>
          <p className="text-sm text-kh-red">
            Kunde inte ladda dashboard-data.
          </p>
        </Card>
      </>
    );
  }

  const billingTotal = data.pricePerScan * data.totalScans;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="mt-1 text-sm text-text-muted">
          {data.companyName} · {data.orgnr}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Get started with Kataloghub">
          <ol className="list-decimal pl-5 text-sm text-text">
            <li className="py-0.5">
              <Link href="/kataloghub/upload" className="text-kh-green underline hover:text-kh-green-dark">
                Upload catalog (CSV)
              </Link>
            </li>
            <li className="py-0.5">Run scan</li>
            <li className="py-0.5">Download worksheet</li>
            <li className="py-0.5">Send worksheet to HeyRoya</li>
          </ol>
        </Card>

        <Card title="Att göra · To-do">
          <ul className="space-y-1 text-sm text-text">
            <li>• {data.pendingScans} scans pending</li>
            <li>• {data.pendingWorksheets} worksheets awaiting confirmation</li>
            <li>• {data.completedReports} reports ready</li>
          </ul>
        </Card>

        <Card title="Insikter · Insights">
          <ul className="space-y-1 text-sm text-text">
            <li>Total scans: {data.totalScans}</li>
            <li>Last scan: {data.lastScan}</li>
          </ul>
        </Card>

        <Card title="Hur det går · Status">
          <p className="mb-2 text-sm text-text">
            Avg health (last scan):{" "}
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
        <Card title="Företaget · Your catalogs">
          <ul className="space-y-1 text-sm text-text">
            <li>{data.totalScans} totala scans</li>
            <li>{data.pendingWorksheets} pending corrections</li>
          </ul>
        </Card>

        <Card title="Fakturering · Billing">
          <p className="text-sm text-text-muted">
            Pris per scan: <strong className="text-text">{data.pricePerScan} SEK</strong>
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Antal scans: <strong className="text-text">{data.totalScans}</strong>
          </p>
          <p className="mt-2 text-base font-semibold text-text">
            Total: {billingTotal.toLocaleString("sv-SE")} SEK
          </p>
        </Card>
      </section>
    </>
  );
}
