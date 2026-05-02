import Link from "next/link";
import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";
import { CwrReadyBadge } from "@/app/components/CwrReadyBadge";
import { BeforeAfterTabs } from "@/app/components/BeforeAfterTabs";
import { FixInSourceSystem } from "@/app/components/FixInSourceSystem";
import { ValidationVsCorrection } from "@/app/components/ValidationVsCorrection";
import { ScoreNumber } from "@/app/components/ScoreNumber";
import { ExportSection } from "@/app/components/ExportSection";
import { mockHealthReport } from "@/lib/mock";

export default async function HealthReportPage({
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
          <h1 className="text-2xl font-semibold">Metadata Health Report</h1>
          <p className="mt-1 text-sm text-text-muted">
            Catalog: {report.catalog.works} works ·{" "}
            {report.catalog.contributorEntries} contributor entries
          </p>
          <p className="mt-1 font-mono text-xs text-text-muted">
            Scan ID: {report.scanId} · Generated {report.generated}
          </p>
        </div>
        <CwrReadyBadge report={report} />
      </header>

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Score">
          <ScoreNumber score={report.score} />
        </Card>
        <Card title="Blocking">
          <Pill tone={report.counts.blocking === 0 ? "green" : "red"}>
            {report.counts.blocking}
          </Pill>
        </Card>
        <Card title="Resolvable">
          <Pill tone={report.counts.resolvable === 0 ? "green" : "yellow"}>
            {report.counts.resolvable}
          </Pill>
        </Card>
        <Card title="Residual">
          <Pill tone={report.counts.residual === 0 ? "green" : "yellow"}>
            {report.counts.residual}
          </Pill>
        </Card>
      </section>

      <section className="mb-6">
        <Card title="Before / After">
          <BeforeAfterTabs report={report} />
        </Card>
      </section>

      <section className="mb-6">
        <Card title="Per-work status">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="py-2 font-semibold">work_id</th>
                <th className="py-2 font-semibold">title</th>
                <th className="py-2 font-semibold">status</th>
                <th className="py-2 font-semibold">issue fields</th>
              </tr>
            </thead>
            <tbody>
              {report.works.map((w) => (
                <tr
                  key={w.workId}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-2 font-mono text-xs text-kh-green">
                    {w.workId}
                  </td>
                  <td className="py-2">{w.title}</td>
                  <td className="py-2">
                    <Pill tone={w.severity === "clean" ? "green" : "red"}>
                      {w.severity === "clean" ? "Ren" : "Avvikelser"}
                    </Pill>
                  </td>
                  <td className="py-2 text-text-muted">
                    {w.issueFields.length === 0
                      ? "—"
                      : w.issueFields.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <FixInSourceSystem />
        <ValidationVsCorrection />
      </section>

      <section className="mb-6">
        <ExportSection catalogId={id} />
      </section>

      <section className="flex flex-wrap gap-3">
        <Link
          href={`/scan-history`}
          className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
        >
          Back to scan history
        </Link>
      </section>
    </>
  );
}
