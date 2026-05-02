"use client";

import Link from "next/link";
import { Card } from "@/app/components/Card";

export default function ScanFailedPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Skanningen misslyckades</h1>
        <p className="mt-1 text-sm text-text-muted">
          Filen kunde inte bearbetas. Kontrollera att den uppfyller kraven nedan.
        </p>
      </header>

      <Card title="Krav på katalogfilen">
        <ul className="space-y-1 text-sm text-text">
          <li>· Maxstorlek: 50 MB</li>
          <li>· Endast CSV-format (.csv)</li>
          <li>· Ingen lösenordsskyddad fil</li>
          <li>· Ingen Excel-fil (.xlsx)</li>
          <li>· UTF-8-kodad text rekommenderas</li>
        </ul>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/kataloghub/upload"
            className="rounded bg-kh-green px-4 py-2 text-sm font-semibold text-white hover:bg-kh-green-dark"
          >
            Försök igen
          </Link>
          <Link
            href="/kataloghub"
            className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
          >
            Tillbaka till dashboard
          </Link>
        </div>
      </Card>
    </>
  );
}
