"use client";

import useSWR from "swr";
import { Card } from "@/app/components/Card";

type Company = {
  companyName: string;
  orgnr: string;
  contact: string;
  email: string;
};

import { apiFetcher } from "@/lib/api";

export default function CompanySettingsPage() {
  const { data, error, isLoading } = useSWR<Company>(
    "/api/kataloghub/company",
    apiFetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda företagsinställningar.</p>;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Företagsinställningar</h1>
        <p className="mt-1 text-sm text-text-muted">
          Företagsuppgifter och kontaktperson.
        </p>
      </header>

      <Card title="Företag">
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-text-muted">Företag</dt>
            <dd className="font-medium text-text">{data.companyName}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Org.nr</dt>
            <dd className="font-mono text-text">{data.orgnr}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Kontaktperson</dt>
            <dd className="font-medium text-text">{data.contact}</dd>
          </div>
          <div>
            <dt className="text-text-muted">E-post</dt>
            <dd className="font-mono text-text">{data.email}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <button
            type="button"
            disabled
            className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text-muted disabled:cursor-not-allowed"
          >
            Redigera (kommer snart)
          </button>
        </div>
      </Card>
    </>
  );
}
