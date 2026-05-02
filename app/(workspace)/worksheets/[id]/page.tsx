import { Card } from "@/app/components/Card";
import { WorksheetEditor } from "@/app/components/WorksheetEditor";
import { mockWorksheet } from "@/lib/mock";

export default async function WorksheetEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = mockWorksheet(id);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Worksheet</h1>
        <p className="mt-1 text-sm text-text-muted">
          Catalog {id} · {rows.length} issues. Confirm or reject each
          suggested correction. Send the completed worksheet to HeyRoya.
        </p>
      </header>

      <Card>
        <WorksheetEditor catalogId={id} initialRows={rows} />
      </Card>

      <div className="mt-4 rounded border border-border bg-surface p-4 text-sm text-text-muted">
        <p>
          <strong className="text-text">Publisher confirmation required.</strong>{" "}
          No corrections are applied without explicit accept/edit decisions on
          the rows below. Kataloghub does not modify your catalog.
        </p>
      </div>
    </>
  );
}
