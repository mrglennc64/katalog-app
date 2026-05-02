import { NextResponse } from "next/server";

/**
 * GET /api/kataloghub/dashboard
 * Mock dashboard data for the Kataloghub workspace home.
 * Real implementation should aggregate from the auto repo's Postgres
 * tenant + scan tables.
 */
export async function GET() {
  return NextResponse.json({
    pendingScans: 3,
    completedReports: 1,
    pendingWorksheets: 1,
    totalScans: 12,
    lastScan: "2026-05-02",
    avgHealth: 87,
    pricePerScan: 999,
    companyName: "Example Publishing AB",
    orgnr: "556123-4567",
  });
}
