"use client";

import { use } from "react";
import useSWR from "swr";

type Row = {
  work_id: string;
  field: string;
  value: string;
  status: string;
};

type Report = {
  catalogName?: string;
  timestamp?: string;
  score?: number;
  issues?: { clean: number; resolvable: number; blocking: number };
  before: Row[];
  after?: Row[];
};

import { apiFetcher } from "@/lib/api";

export default function HealthReportPdf({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, error, isLoading } = useSWR<Report>(
    `/api/kataloghub/health-report/${id}`,
    apiFetcher,
  );

  if (isLoading) return <p style={{ padding: 24 }}>Laddar…</p>;
  if (error || !data) return <p style={{ padding: 24, color: "#c43838" }}>Kunde inte ladda rapporten.</p>;

  const issues = data.issues || { clean: 0, resolvable: 0, blocking: 0 };
  const score = data.score ?? "—";
  const catalogName = data.catalogName || "Katalog";
  const timestamp = data.timestamp || new Date().toISOString().slice(0, 10);

  return (
    <div
      style={{
        background: "#fff",
        color: "#111",
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        lineHeight: 1.55,
        padding: "32px 28px 64px",
        maxWidth: 1080,
        margin: "0 auto",
      }}
    >
      <button
        type="button"
        onClick={() => window.print()}
        style={{
          background: "#1f7a3a",
          color: "#fff",
          border: 0,
          borderRadius: 4,
          padding: "8px 14px",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 12,
          marginBottom: 16,
        }}
        className="print:hidden"
      >
        Skriv ut / Spara som PDF
      </button>

      <h1 style={{ fontSize: 18, color: "#1f7a3a", marginBottom: 6 }}>
        Hälsorapport
      </h1>
      <p style={{ fontSize: 12, color: "#555" }}>
        Katalog: {catalogName}
      </p>
      <p style={{ fontSize: 12, color: "#555" }}>
        Scan-ID: {id} · Skapad {timestamp}
      </p>

      <h2 style={{ fontSize: 13, textTransform: "uppercase", color: "#1f7a3a", margin: "24px 0 8px" }}>
        Sammanfattning
      </h2>
      <div style={{ border: "1px solid #e5e5e5", borderRadius: 6, padding: "12px 16px", fontSize: 13 }}>
        <p style={{ margin: "4px 0" }}>Hälsopoäng: <strong>{String(score)}</strong></p>
        <p style={{ margin: "4px 0" }}>Blockerande: <strong>{issues.blocking}</strong></p>
        <p style={{ margin: "4px 0" }}>Åtgärdbara: <strong>{issues.resolvable}</strong></p>
        <p style={{ margin: "4px 0" }}>OK: <strong>{issues.clean}</strong></p>
      </div>

      <h2 style={{ fontSize: 13, textTransform: "uppercase", color: "#1f7a3a", margin: "24px 0 8px" }}>
        Detaljer
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12,
          border: "1px solid #e5e5e5",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, textTransform: "uppercase", color: "#555" }}>work_id</th>
            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, textTransform: "uppercase", color: "#555" }}>fält</th>
            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, textTransform: "uppercase", color: "#555" }}>värde</th>
            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, textTransform: "uppercase", color: "#555" }}>status</th>
          </tr>
        </thead>
        <tbody>
          {data.before.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #e5e5e5" }}>
              <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#1f7a3a" }}>{row.work_id}</td>
              <td style={{ padding: "10px 14px", fontFamily: "monospace" }}>{row.field}</td>
              <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#555" }}>{row.value || "—"}</td>
              <td style={{ padding: "10px 14px" }}>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 6,
          padding: "12px 16px",
          marginTop: 18,
          fontSize: 12,
          color: "#444",
        }}
      >
        Denna rapport är endast en validering. Inga korrigeringar har utförts.
      </p>
    </div>
  );
}
