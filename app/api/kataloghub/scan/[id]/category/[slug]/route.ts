import { NextResponse } from "next/server";

const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const REQUIRE_BACKEND = process.env.KATALOGHUB_REQUIRE_BACKEND === "true";

const CATEGORY_META: Record<string, { name: string; description: string }> = {
  identifiers: {
    name: "Identifierare",
    description: "Saknad eller ogiltig work_id, ISWC, ISRC eller writer_ipi.",
  },
  splits: {
    name: "Andelar",
    description: "Andelar som inte summerar till 100 % per verk.",
  },
  roles: {
    name: "Rollkoder",
    description: "Ogiltig rollkod (förväntade värden: C, CA, A).",
  },
  duplicates: {
    name: "Dubbletter",
    description: "Identisk kombination av work_id och writer_ipi.",
  },
  conflicts: {
    name: "Konflikter",
    description: "Motstridiga uppgifter mellan rader för samma verk.",
  },
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string; slug: string }> },
) {
  const { id, slug } = await ctx.params;

  try {
    const headers: Record<string, string> = {};
    if (process.env.FASTAPI_API_KEY) headers["X-API-Key"] = process.env.FASTAPI_API_KEY;
    const res = await fetch(
      `${BACKEND_URL}/api/catalogs/${encodeURIComponent(id)}/category/${encodeURIComponent(slug)}`,
      { headers, signal: AbortSignal.timeout(15_000) },
    );
    if (res.ok) return NextResponse.json(await res.json());
    if (REQUIRE_BACKEND) {
      return NextResponse.json({ error: `backend HTTP ${res.status}` }, { status: res.status });
    }
  } catch (err) {
    if (REQUIRE_BACKEND) {
      return NextResponse.json({ error: `backend unreachable: ${String(err)}` }, { status: 502 });
    }
  }

  const meta = CATEGORY_META[slug] || { name: slug, description: "" };
  const sample: Record<string, { work_id: string; field: string; value: string; status: string }[]> = {
    identifiers: [
      { work_id: "W-007", field: "writer_ipi", value: "", status: "missing" },
      { work_id: "W-001", field: "writer_ipi", value: "1234567", status: "invalid" },
    ],
    splits: [
      { work_id: "W-005", field: "share", value: "60", status: "invalid" },
    ],
    roles: [
      { work_id: "W-011", field: "role_code", value: "WR", status: "invalid" },
    ],
    duplicates: [
      { work_id: "W-001", field: "duplicate", value: "00712984310", status: "invalid" },
    ],
    conflicts: [],
  };

  return NextResponse.json({
    categoryName: meta.name,
    description: meta.description,
    rows: sample[slug] || [],
  });
}
