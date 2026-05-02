import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    pricePerScan: 999,
    totalScans: 12,
    history: [
      { month: "2026-04", scans: 4, total: 3996 },
      { month: "2026-03", scans: 5, total: 4995 },
      { month: "2026-02", scans: 3, total: 2997 },
    ],
  });
}
