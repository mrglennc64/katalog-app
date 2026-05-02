import Link from "next/link";
import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";
import { HowToFix } from "@/app/components/HowToFix";
import { NextSteps } from "@/app/components/NextSteps";
import { CwrReadyBadge } from "@/app/components/CwrReadyBadge";
import { FixInSourceSystem } from "@/app/components/FixInSourceSystem";
import { ScoreNumber } from "@/app/components/ScoreNumber";
import { mockHealthReport } from "@/lib/mock";

export default async function ScanResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = mockHealthReport(id);

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Scan result</h1>
          <p className="mt-1 text-sm text-text-muted">
            {report.catalog.name} · {report.catalog.works} works ·{" "}
            {report.catalog.contributorEntries} contributor entries
          </p>
          <p className="mt-1 font-mono text-xs text-text-muted">
            Scan ID: {report.scanId} · Generated {report.generated}
          </p>
        </div>
        <CwrReadyBadge report={report} />
      </header>

      <section className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Score">
          <ScoreNumber score={report.score} />
        </Card>
        <Card title="Blocking">
          <p>
            <Pill tone={report.counts.blocking === 0 ? "green" : "red"}>
              {report.counts.blocking}
            </Pill>
          </p>
        </Card>
        <Card title="Resolvable">
          <p>
            <Pill tone={report.counts.resolvable === 0 ? "green" : "yellow"}>
              {report.counts.resolvable}
            </Pill>
          </p>
        </Card>
        <Card title="Residual">
          <p>
            <Pill tone={report.counts.residual === 0 ? "green" : "yellow"}>
              {report.counts.residual}
            </Pill>
          </p>
        </Card>
      </section>

      <section className="mb-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Issue types">
          <ul className="m-0 list-none p-0">
            {report.issueTypes.map((it) => (
              <HowToFix key={it.field} issue={it} />
            ))}
          </ul>
        </Card>
        <NextSteps />
      </section>

      <section className="mb-4 flex flex-wrap gap-3">
        <Link
          href={`/health-report/${id}`}
          className="rounded bg-kh-green px-4 py-2 text-sm font-semibold text-white hover:bg-kh-green-dark"
        >
          View full health report
        </Link>
        <Link
          href={`/api/catalogs/${id}/worksheet`}
          className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
        >
          Download worksheet
        </Link>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <FixInSourceSystem />
        <Card title="Boundaries">
          <ul className="space-y-1 text-sm text-text-muted">
            <li>· File-based only</li>
            <li>· No system access</li>
            <li>· No automation</li>
            <li>· No automatic changes</li>
          </ul>
          <p className="mt-3 text-xs text-text-muted">
            All corrections require explicit publisher confirmation.
          </p>
        </Card>
      </section>
    </>
  );
}
