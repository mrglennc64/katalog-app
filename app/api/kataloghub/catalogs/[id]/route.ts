import { NextResponse } from "next/server";

const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const REQUIRE_BACKEND = process.env.KATALOGHUB_REQUIRE_BACKEND === "true";
const API_KEY = process.env.FASTAPI_API_KEY;

function authHeaders(): Record<string, string> {
  return API_KEY ? { "X-API-Key": API_KEY } : {};
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/catalogs/${encodeURIComponent(id)}`, {
      headers: authHeaders(),
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
    id,
    name: "Example Publishing Q2",
    scans: [
      { id: "HR-20260502-A1B2", timestamp: "2026-05-02 14:32", score: 87 },
      { id: "HR-20260418-C3D4", timestamp: "2026-04-18 09:14", score: 94 },
      { id: "HR-20260321-E5F6", timestamp: "2026-03-21 11:08", score: 72 },
    ],
  });
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  let body: { name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const name = (body?.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "missing 'name'" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/catalogs/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
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

  return NextResponse.json({ id, name });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/catalogs/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: authHeaders(),
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) return NextResponse.json({ ok: true });
    if (REQUIRE_BACKEND) {
      return NextResponse.json({ error: `backend HTTP ${res.status}` }, { status: res.status });
    }
  } catch (err) {
    if (REQUIRE_BACKEND) {
      return NextResponse.json({ error: `backend unreachable: ${String(err)}` }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true, deleted: id });
}
