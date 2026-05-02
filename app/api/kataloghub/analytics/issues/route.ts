import { NextResponse } from "next/server";

const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const REQUIRE_BACKEND = process.env.KATALOGHUB_REQUIRE_BACKEND === "true";

export async function GET() {
  try {
    const headers: Record<string, string> = {};
    if (process.env.FASTAPI_API_KEY) headers["X-API-Key"] = process.env.FASTAPI_API_KEY;
    const res = await fetch(`${BACKEND_URL}/api/catalogs/analytics/issues`, {
      headers,
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) return NextResponse.json(await res.json());
    if (REQUIRE_BACKEND) {
      return NextResponse.json({ error: `backend HTTP ${res.status}` }, { status: res.status });
    }
  } catch (err) {
    if (REQUIRE_BACKEND) {
      return NextResponse.json({ error: `backend unreachable: ${String(err)}` }, { status: 502 });
    }
  }

  return NextResponse.json([
    { category: "Saknad ISWC", count: 24 },
    { category: "Ogiltigt IPI-format", count: 18 },
    { category: "Andelar summerar inte till 100 %", count: 11 },
    { category: "Ogiltig rollkod", count: 7 },
    { category: "Dubbletter (work_id + writer_ipi)", count: 4 },
  ]);
}
