import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";

export default function DashboardPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="mt-1 text-sm text-text-muted">
          File-based metadata validation. No system access. No ingestion.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Get started with Kataloghub">
          <ol className="list-decimal pl-5 text-sm text-text">
            <li className="py-0.5">Upload catalog (CSV)</li>
            <li className="py-0.5">Run scan</li>
            <li className="py-0.5">Download worksheet</li>
            <li className="py-0.5">Send worksheet to HeyRoya</li>
          </ol>
        </Card>

        <Card title="Att göra · To-do">
          <ul className="space-y-1 text-sm text-text">
            <li>• 2 worksheets awaiting confirmation</li>
            <li>• 1 catalog ready for export</li>
          </ul>
        </Card>

        <Card title="Insikter · Insights">
          <ul className="space-y-1 text-sm text-text">
            <li>Most common issue: Missing ISWC</li>
            <li>Last 30 days: 12 catalogs validated</li>
          </ul>
        </Card>

        <Card title="Hur det går · Status">
          <p className="mb-2 text-sm text-text">
            Health score (last scan):{" "}
            <strong className="text-base">98 / 100</strong>
          </p>
          <div className="space-y-1.5">
            <div>
              <Pill tone="green">Blocking: 0</Pill>
            </div>
            <div>
              <Pill tone="yellow">Resolvable: 2</Pill>
            </div>
            <div>
              <Pill tone="neutral">Residual: 0</Pill>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <Card title="Företaget · Your catalogs">
          <ul className="space-y-1 text-sm text-text">
            <li>3 active catalogs</li>
            <li>0 pending corrections</li>
          </ul>
        </Card>
      </section>
    </>
  );
}
