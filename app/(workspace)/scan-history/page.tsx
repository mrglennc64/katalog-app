import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";

const SCANS = [
  {
    id: "HR-20260502-A1B2",
    catalog: "Midnattssol-2026Q2",
    works: 31,
    issues: 6,
    blocking: 4,
    date: "2026-05-02",
    status: "Worksheet pending",
  },
  {
    id: "HR-20260428-7XKR",
    catalog: "Stjärnvägen-spring",
    works: 14,
    issues: 0,
    blocking: 0,
    date: "2026-04-28",
    status: "CWR-ready",
  },
];

export default function ScanHistoryPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Scan History</h1>
        <p className="mt-1 text-sm text-text-muted">
          Chronological log of validations, worksheets, and exports.
        </p>
      </header>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-muted">
              <th className="py-2 font-semibold">Scan ID</th>
              <th className="py-2 font-semibold">Catalog</th>
              <th className="py-2 font-semibold">Works</th>
              <th className="py-2 font-semibold">Issues</th>
              <th className="py-2 font-semibold">Status</th>
              <th className="py-2 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {SCANS.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="py-3 font-mono text-xs text-kh-green">{s.id}</td>
                <td className="py-3">{s.catalog}</td>
                <td className="py-3 font-mono text-xs">{s.works}</td>
                <td className="py-3 font-mono text-xs">
                  {s.issues}
                  {s.blocking > 0 && (
                    <span className="ml-2 text-kh-red">
                      ({s.blocking} blocking)
                    </span>
                  )}
                </td>
                <td className="py-3">
                  <Pill tone={s.blocking > 0 ? "yellow" : "green"}>
                    {s.status}
                  </Pill>
                </td>
                <td className="py-3 text-text-muted">{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
