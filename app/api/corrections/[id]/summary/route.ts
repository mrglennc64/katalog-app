import { NextResponse } from "next/server";
import { mockCorrectionSummary } from "@/lib/mock";

/**
 * GET /api/corrections/{id}/summary
 * HeyRoya correction summary: applied / rejected / edited / unresolved
 * + auto-calculated billing (price_per_work × applied).
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  return NextResponse.json(mockCorrectionSummary(id));
}
