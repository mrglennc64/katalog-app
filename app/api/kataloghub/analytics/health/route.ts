import { NextResponse } from "next/server";

const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const REQUIRE_BACKEND = process.env.KATALOGHUB_REQUIRE_BACKEND === "true";

export async function GET() {
  try {
    const headers: Record<string, string> = {};
    if (process.env.FASTAPI_API_KEY) headers["X-API-Key"] = process.env.FASTAPI_API_KEY;
    const res = await fetch(`${BACKEND_URL}/api/catalogs/analytics/health`, {
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
    { timestamp: "2026-01", score: 64 },
    { timestamp: "2026-02", score: 71 },
    { timestamp: "2026-03", score: 72 },
    { timestamp: "2026-04", score: 84 },
    { timestamp: "2026-05", score: 87 },
  ]);
}
