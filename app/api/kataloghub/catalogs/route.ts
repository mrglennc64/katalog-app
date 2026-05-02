import { NextResponse } from "next/server";

const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const REQUIRE_BACKEND = process.env.KATALOGHUB_REQUIRE_BACKEND === "true";

export async function GET() {
  try {
    const headers: Record<string, string> = {};
    if (process.env.FASTAPI_API_KEY) headers["X-API-Key"] = process.env.FASTAPI_API_KEY;
    const res = await fetch(`${BACKEND_URL}/api/catalogs`, {
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
      id: "C-001",
      name: "Example Publishing Q2",
      lastScan: "2026-05-02",
      lastScanId: "HR-20260502-A1B2",
      score: 87,
      blocking: 1,
      resolvable: 3,
    },
    {
      id: "C-002",
      name: "Example Publishing Q1",
      lastScan: "2026-04-18",
      lastScanId: "HR-20260418-C3D4",
      score: 94,
      blocking: 0,
      resolvable: 1,
    },
    {
      id: "C-003",
      name: "Example Publishing 2025",
      lastScan: "2026-03-21",
      lastScanId: "HR-20260321-E5F6",
      score: 72,
      blocking: 4,
      resolvable: 8,
    },
  ]);
}
