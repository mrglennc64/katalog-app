import { NextResponse } from "next/server";

const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const REQUIRE_BACKEND = process.env.KATALOGHUB_REQUIRE_BACKEND === "true";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  try {
    const headers: Record<string, string> = {};
    if (process.env.FASTAPI_API_KEY) headers["X-API-Key"] = process.env.FASTAPI_API_KEY;
    const res = await fetch(`${BACKEND_URL}/api/catalogs/${encodeURIComponent(id)}/scan`, {
      headers,
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) {
      const json = await res.json();
      return NextResponse.json(json);
    }
    if (REQUIRE_BACKEND) {
      return NextResponse.json({ error: `backend HTTP ${res.status}` }, { status: res.status });
    }
  } catch (err) {
    if (REQUIRE_BACKEND) {
      return NextResponse.json({ error: `backend unreachable: ${String(err)}` }, { status: 502 });
    }
  }

  return NextResponse.json({
    scan_id: id,
    score: 87,
    timestamp: new Date().toISOString(),
    issues: { clean: 11, resolvable: 3, blocking: 1 },
    categories: [
      { name: "Saknad work_id", count: 1 },
      { name: "Ogiltigt IPI-format", count: 2 },
      { name: "Ogiltig rollkod", count: 1 },
      { name: "Dubbletter", count: 1 },
    ],
  });
}
