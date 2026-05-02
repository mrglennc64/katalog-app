"use client";

import useSWR from "swr";
import { Card } from "@/app/components/Card";

type Point = { timestamp: string; score: number };

import { apiFetcher } from "@/lib/api";

export default function HealthTrendPage() {
  const { data, error, isLoading } = useSWR<Point[]>(
    "/api/kataloghub/analytics/health",
    apiFetcher,
  );

  if (isLoading) return <p className="text-sm text-text-muted">Laddar…</p>;
  if (error || !data) return <p className="text-sm text-kh-red">Kunde inte ladda trend.</p>;

  const W = 600;
  const H = 200;
  const PAD = 20;
  const n = data.length;
  const xFor = (i: number) => (n <= 1 ? W / 2 : PAD + (i * (W - 2 * PAD)) / (n - 1));
  const yFor = (s: number) => H - PAD - ((s / 100) * (H - 2 * PAD));

  const linePath = data
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(p.score)}`)
    .join(" ");

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Hälsotrend</h1>
        <p className="mt-1 text-sm text-text-muted">
          Hälsopoäng över tid.
        </p>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-3xl">
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--kh-border)" strokeWidth="1" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="var(--kh-border)" strokeWidth="1" />
            {[0, 25, 50, 75, 100].map((s) => (
              <g key={s}>
                <line
                  x1={PAD}
                  y1={yFor(s)}
                  x2={W - PAD}
                  y2={yFor(s)}
                  stroke="var(--kh-border)"
                  strokeDasharray="2,3"
                  strokeWidth="0.5"
                />
                <text x={PAD - 4} y={yFor(s) + 3} fontSize="9" textAnchor="end" fill="var(--kh-text-muted)">
                  {s}
                </text>
              </g>
            ))}
            {n > 1 && <path d={linePath} stroke="var(--kh-green)" strokeWidth="2" fill="none" />}
            {data.map((p, i) => (
              <g key={p.timestamp}>
                <circle cx={xFor(i)} cy={yFor(p.score)} r="4" fill="var(--kh-green)" />
                <text x={xFor(i)} y={H - PAD + 14} fontSize="10" textAnchor="middle" fill="var(--kh-text-muted)">
                  {p.timestamp}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <ul className="mt-4 space-y-1 text-sm text-text">
          {data.map((p) => (
            <li key={p.timestamp} className="flex justify-between border-b border-border pb-1 last:border-0">
              <span className="font-mono text-text-muted">{p.timestamp}</span>
              <strong>{p.score}</strong>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
