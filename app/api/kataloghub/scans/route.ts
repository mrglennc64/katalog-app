import { NextResponse } from "next/server";

const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const REQUIRE_BACKEND = process.env.KATALOGHUB_REQUIRE_BACKEND === "true";

export async function GET() {
  try {
    const headers: Record<string, string> = {};
    if (process.env.FASTAPI_API_KEY) headers["X-API-Key"] = process.env.FASTAPI_API_KEY;
    const res = await fetch(`${BACKEND_URL}/api/catalogs/scans`, {
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
    {
      id: "HR-20260502-A1B2",
      timestamp: "2026-05-02 14:32",
      catalogName: "Example Publishing Q2",
      score: 87,
      blocking: 1,
      resolvable: 3,
    },
    {
      id: "HR-20260418-C3D4",
      timestamp: "2026-04-18 09:14",
      catalogName: "Example Publishing Q1",
      score: 94,
      blocking: 0,
      resolvable: 1,
    },
    {
      id: "HR-20260321-E5F6",
      timestamp: "2026-03-21 11:08",
      catalogName: "Example Publishing 2025",
      score: 72,
      blocking: 4,
      resolvable: 8,
    },
  ]);
}
