import { NextResponse } from "next/server";
import { mockHealthReport } from "@/lib/mock";

/**
 * POST /api/catalogs/{id}/scan
 * Run the validator against the uploaded catalog and return the health
 * report. Mock: returns the canned report immediately.
 */
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const report = mockHealthReport(id);
  return NextResponse.json(report);
}
