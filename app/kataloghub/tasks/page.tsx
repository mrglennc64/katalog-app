"use client";

import useSWR from "swr";
import { Card } from "@/app/components/Card";
import { Pill } from "@/app/components/Pill";

type Task = {
  id: string;
  work_id: string;
  field: string;
  issue: string;
  category: string;
  status: "open" | "deferred" | "done" | string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function tonefor(status: string): "green" | "yellow" | "red" | "neutral" {
  if (status === "done") return "green";
  if (status === "deferred") return "yellow";
  if (status === "open") return "red";
  return "neutral";
}

export default function FixLaterTasks() {
  const { data, error, isLoading } = useSWR<Task[]>(
    "/api/kataloghub/tasks",
    fetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda uppgifter.</p>;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Att åtgärda senare</h1>
        <p className="mt-1 text-sm text-text-muted">
          Avvikelser som skjutits upp till senare.
        </p>
      </header>

      <Card title={`Uppgifter (${data.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-muted">
                <th className="py-2 pr-3 font-semibold">work_id</th>
                <th className="py-2 pr-3 font-semibold">fält</th>
                <th className="py-2 pr-3 font-semibold">problem</th>
                <th className="py-2 pr-3 font-semibold">kategori</th>
                <th className="py-2 font-semibold">status</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-kh-green">
                    Inga uppgifter.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs text-kh-green">{row.work_id}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-text">{row.field}</td>
                    <td className="py-2 pr-3 text-text">{row.issue}</td>
                    <td className="py-2 pr-3 text-text-muted">{row.category}</td>
                    <td className="py-2">
                      <Pill tone={tonefor(row.status)}>{row.status}</Pill>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
