import { NextResponse } from "next/server";
import { mockHealthReport } from "@/lib/mock";

/**
 * GET /api/catalogs/{id}/health-report
 * Returns the catalog's metadata health report. Mocked.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const report = mockHealthReport(id);
  return NextResponse.json(report);
}
