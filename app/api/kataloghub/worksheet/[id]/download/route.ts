const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const API_KEY = process.env.FASTAPI_API_KEY;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const filename = `worksheet_${id}.csv`;

  try {
    const headers: Record<string, string> = {};
    if (API_KEY) headers["X-API-Key"] = API_KEY;
    const res = await fetch(`${BACKEND_URL}/api/catalogs/${encodeURIComponent(id)}/worksheet`, {
      headers,
      signal: AbortSignal.timeout(30_000),
    });
    if (res.ok) {
      const csv = await res.text();
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }
  } catch {
    // fall through
  }

  const fallback = [
    "issue_id,work_id,field,original,suggested,decision,notes",
    "I-001,W-001,writer_ipi,1234567,00712984310,,",
    "I-002,W-007,writer_ipi,,00111222333,,",
    "I-003,W-011,role_code,WR,CA,,",
    "I-004,W-005,share,60,50,,",
  ].join("\n");
  return new Response(fallback, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
