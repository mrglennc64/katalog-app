import Link from "next/link";
import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";

const WORKSHEETS = [
  {
    catalogId: "HR-20260502-A1B2",
    catalogName: "Midnattssol-2026Q2",
    issues: 3,
    status: "Pending publisher decisions",
    createdAt: "2026-05-02",
  },
  {
    catalogId: "HR-20260428-7XKR",
    catalogName: "Stjärnvägen-spring",
    issues: 0,
    status: "Sent to HeyRoya",
    createdAt: "2026-04-28",
  },
];

export default function WorksheetsPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Worksheets</h1>
        <p className="mt-1 text-sm text-text-muted">
          Generated correction worksheets. Confirm decisions and send to
          HeyRoya for processing.
        </p>
      </header>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-muted">
              <th className="py-2 font-semibold">Catalog</th>
              <th className="py-2 font-semibold">Issues</th>
              <th className="py-2 font-semibold">Status</th>
              <th className="py-2 font-semibold">Created</th>
              <th className="py-2 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {WORKSHEETS.map((w) => (
              <tr
                key={w.catalogId}
                className="border-b border-border last:border-0"
              >
                <td className="py-3">
                  <span className="block font-medium text-text">
                    {w.catalogName}
                  </span>
                  <span className="block font-mono text-xs text-text-muted">
                    {w.catalogId}
                  </span>
                </td>
                <td className="py-3 font-mono text-xs">{w.issues}</td>
                <td className="py-3">
                  <Pill tone={w.issues > 0 ? "yellow" : "green"}>
                    {w.status}
                  </Pill>
                </td>
                <td className="py-3 text-text-muted">{w.createdAt}</td>
                <td className="py-3 text-right">
                  <Link
                    href={`/worksheets/${w.catalogId}`}
                    className="text-sm font-medium text-kh-green hover:underline"
                  >
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
