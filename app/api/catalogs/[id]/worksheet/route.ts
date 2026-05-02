import { mockWorksheet } from "@/lib/mock";

/**
 * GET /api/catalogs/{id}/worksheet
 * Returns the correction worksheet as CSV. 7 columns, fillable round-trip.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const rows = mockWorksheet(id);

  const header = "issue_id,work_id,field,original,suggested,decision,notes";
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = rows
    .map((r) =>
      [
        r.issue_id,
        r.work_id,
        r.field,
        r.original,
        r.suggested,
        r.decision ?? "",
        r.notes ?? "",
      ]
        .map(escape)
        .join(","),
    )
    .join("\n");

  return new Response(`${header}\n${body}\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kataloghub-worksheet-${id}.csv"`,
    },
  });
}
