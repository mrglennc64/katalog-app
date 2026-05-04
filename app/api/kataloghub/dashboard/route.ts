import { NextResponse } from "next/server";

/**
 * GET /api/kataloghub/dashboard
 * Mock dashboard data for the Kataloghub workspace home.
 * Real implementation should aggregate from the auto repo's Postgres
 * tenant + scan tables.
 */
export async function GET() {
  return NextResponse.json({
    // Company
    companyName: "Example Publishing AB",
    orgnr: "556123-4567",
    activePlan: "0–500 works",
    monthlyFee: 2000,

    // Usage
    validationsThisMonth: 12,
    pendingCorrections: 1,

    // Billing
    currentPeriod: "May 2026",
    billingAmount: 2000,
    billingStatus: "Not invoiced",

    // Existing dashboard widgets
    pendingScans: 3,
    completedReports: 1,
    pendingWorksheets: 1,
    totalScans: 12,
    lastScan: "2026-05-02",
    avgHealth: 87,
  });
}
