import Link from "next/link";
import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";

const WORKSHEETS = [
  {
    catalogId: "HR-20260502-A1B2",
    catalogName: "Midnattssol-2026Q2",
    issues: 3,
    status: "Väntar beslut",
    createdAt: "2026-05-02",
  },
  {
    catalogId: "HR-20260428-7XKR",
    catalogName: "Stjärnvägen-spring",
    issues: 0,
    status: "Skickat till HeyRoya",
    createdAt: "2026-04-28",
  },
];

export default function WorksheetsPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold uppercase">Arbetsblad</h1>
        <p className="mt-1 text-sm text-text-muted">
          Genererade arbetsblad. Bekräfta beslut och skicka till HeyRoya för korrigering.
        </p>
      </header>

      <Card>
        {WORKSHEETS.length === 0 ? (
          <p className="text-sm text-text-muted">Inga arbetsblad.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="py-2 font-semibold">Katalog</th>
                <th className="py-2 font-semibold">Avvikelser</th>
                <th className="py-2 font-semibold">Status</th>
                <th className="py-2 font-semibold">Skapad</th>
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
                      href={`/kataloghub/worksheet/${w.catalogId}`}
                      className="text-sm font-medium text-kh-green hover:underline"
                    >
                      Öppna →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
