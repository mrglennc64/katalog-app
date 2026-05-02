import { NextResponse } from "next/server";

const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const REQUIRE_BACKEND = process.env.KATALOGHUB_REQUIRE_BACKEND === "true";

export async function POST(req: Request) {
  let body: { a?: string; b?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const { a, b } = body || {};
  if (!a || !b) {
    return NextResponse.json({ error: "missing 'a' or 'b' scan ID" }, { status: 400 });
  }

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.FASTAPI_API_KEY) headers["X-API-Key"] = process.env.FASTAPI_API_KEY;
    const res = await fetch(`${BACKEND_URL}/api/catalogs/compare`, {
      method: "POST",
      headers,
      body: JSON.stringify({ a, b }),
      signal: AbortSignal.timeout(30_000),
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
    a,
    b,
    rows: [
      { work_id: "W-001", field: "writer_ipi", before: "1234567", after: "00712984310" },
      { work_id: "W-007", field: "writer_ipi", before: "", after: "00111222333" },
      { work_id: "W-011", field: "role_code", before: "WR", after: "CA" },
      { work_id: "W-005", field: "share", before: "60", after: "50" },
    ],
  });
}
