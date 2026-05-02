/**
 * GET /api/catalogs/{id}/cwr
 * CWR v2.1 export. In production this proxies the existing FastAPI
 * /api/cwr/generate endpoint (auto repo). Mocked here as a tiny
 * placeholder file so the download button works end-to-end during dev.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const placeholder = [
    "HDRPB000000001KATALOGHUB DEV STUB                                 ",
    "GRHNWR0000102.10            ",
    "TRL000000010000010000000010",
    "",
    `# This is a placeholder CWR file for catalog ${id}. Production`,
    "# builds proxy through to app.services.cwr_builder in the auto repo.",
  ].join("\n");

  return new Response(placeholder, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="kataloghub-cwr-${id}.v21"`,
    },
  });
}
