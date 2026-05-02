import { NextResponse } from "next/server";

const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const REQUIRE_BACKEND = process.env.KATALOGHUB_REQUIRE_BACKEND === "true";

export async function GET() {
  try {
    const headers: Record<string, string> = {};
    if (process.env.FASTAPI_API_KEY) headers["X-API-Key"] = process.env.FASTAPI_API_KEY;
    const res = await fetch(`${BACKEND_URL}/api/catalogs/tasks`, {
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
    { id: "T-001", work_id: "W-007", field: "writer_ipi", issue: "Saknar IPI", category: "identifiers", status: "open" },
    { id: "T-002", work_id: "W-005", field: "share", issue: "Andelar > 100 %", category: "splits", status: "open" },
    { id: "T-003", work_id: "W-011", field: "role_code", issue: "Ogiltig rollkod", category: "roles", status: "deferred" },
    { id: "T-004", work_id: "W-001", field: "duplicate", issue: "Dubblett work_id+ipi", category: "duplicates", status: "open" },
  ]);
}
