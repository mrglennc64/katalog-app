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
    const res = await fetch(`${BACKEND_URL}/api/catalogs/${encodeURIComponent(id)}/health-report`, {
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

  return NextResponse.json({
    before: [
      { work_id: "W-001", field: "writer_ipi", value: "1234567", status: "invalid" },
      { work_id: "W-007", field: "writer_ipi", value: "", status: "missing" },
      { work_id: "W-011", field: "role_code", value: "WR", status: "invalid" },
      { work_id: "W-005", field: "share", value: "60", status: "invalid" },
    ],
    after: [
      { work_id: "W-001", field: "writer_ipi", value: "00712984310", status: "ok" },
      { work_id: "W-007", field: "writer_ipi", value: "00111222333", status: "ok" },
      { work_id: "W-011", field: "role_code", value: "CA", status: "ok" },
      { work_id: "W-005", field: "share", value: "50", status: "ok" },
    ],
  });
}
