import { mockHealthReport } from "@/lib/mock";

/**
 * GET /api/catalogs/{id}/cca
 * Catalog Compliance Attestation — a plain-text artifact summarising the
 * validation outcome for the publisher's records. Mocked.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const r = mockHealthReport(id);

  const text = [
    "KATALOGHUB · CATALOG COMPLIANCE ATTESTATION",
    "============================================",
    "",
    `Catalog            : ${r.catalog.name}`,
    `Catalog ID         : ${r.catalog.id}`,
    `Works              : ${r.catalog.works}`,
    `Contributor entries: ${r.catalog.contributorEntries}`,
    "",
    `Scan ID            : ${r.scanId}`,
    `Generated          : ${r.generated}`,
    `Score              : ${r.score} / 100`,
    `Status             : ${r.status}`,
    "",
    "Counts",
    "------",
    `Blocking issues    : ${r.counts.blocking}`,
    `Resolvable issues  : ${r.counts.resolvable}`,
    `Residual issues    : ${r.counts.residual}`,
    "",
    "Declaration",
    "-----------",
    "This attestation records the result of a file-based metadata",
    "validation. Kataloghub does not modify catalog data, does not access",
    "publisher systems, and does not send corrections to any third party.",
    "All corrections require explicit publisher confirmation via HeyRoya.",
    "",
  ].join("\n");

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="kataloghub-cca-${id}.txt"`,
    },
  });
}
