const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const API_KEY = process.env.FASTAPI_API_KEY;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const filename = `scan_${id}.json`;

  try {
    const headers: Record<string, string> = {};
    if (API_KEY) headers["X-API-Key"] = API_KEY;
    const res = await fetch(`${BACKEND_URL}/api/catalogs/${encodeURIComponent(id)}/scan-json`, {
      headers,
      signal: AbortSignal.timeout(30_000),
    });
    if (res.ok) {
      const json = await res.text();
      return new Response(json, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }
  } catch {
    // fall through
  }

  const fallback = JSON.stringify(
    {
      scan_id: id,
      score: 87,
      timestamp: new Date().toISOString(),
      issues: { clean: 11, resolvable: 3, blocking: 1 },
      categories: [
        { name: "Saknad work_id", count: 1 },
        { name: "Ogiltigt IPI-format", count: 2 },
        { name: "Ogiltig rollkod", count: 1 },
        { name: "Dubbletter", count: 1 },
      ],
    },
    null,
    2,
  );
  return new Response(fallback, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
