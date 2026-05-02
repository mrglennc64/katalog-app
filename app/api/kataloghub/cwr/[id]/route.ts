/**
 * GET /api/kataloghub/cwr/{id}
 *
 * Production CWR export path. Proxies to the existing FastAPI builder:
 *   GET {FASTAPI_URL}/api/cwr/generate?catalog_id={id}
 *
 * If the backend is unreachable (dev), returns a placeholder .v21 body
 * so the download link still works for UI testing.
 */
const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const API_KEY = process.env.FASTAPI_API_KEY;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const filename = `kataloghub-cwr-${id}.v21`;

  // Try the real builder first
  try {
    const headers: Record<string, string> = {};
    if (API_KEY) headers["X-API-Key"] = API_KEY;
    const backendRes = await fetch(
      `${BACKEND_URL}/api/cwr/generate?catalog_id=${encodeURIComponent(id)}`,
      { headers, signal: AbortSignal.timeout(30_000) },
    );
    if (backendRes.ok) {
      const buf = await backendRes.arrayBuffer();
      return new Response(buf, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }
  } catch {
    // fall through
  }

  // Mock fallback
  const placeholder = [
    "HDRPB000000001KATALOGHUB DEV STUB                                 ",
    "GRHNWR0000102.10            ",
    "TRL000000010000010000000010",
    "",
    `# Placeholder CWR for catalog ${id}.`,
    `# Set FASTAPI_URL (and optionally FASTAPI_API_KEY) and have the auto repo`,
    `# running on that host to get a real .v21 file from cwr_builder.`,
  ].join("\n");
  return new Response(placeholder, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
