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
        <h1 className="text-3xl font-bold uppercase">Arbetsblad</h1>
        <p className="mt-1 text-sm text-text-muted">
          Katalog {id} · {rows.length} avvikelser. Bekräfta eller avslå varje
          föreslagen korrigering. Skicka det ifyllda arbetsbladet till HeyRoya.
        </p>
      </header>

      <Card>
        <WorksheetEditor catalogId={id} initialRows={rows} />
      </Card>

      <div className="mt-4 rounded border border-border bg-surface p-4 text-sm text-text-muted">
        <p>
          <strong className="text-text">Publicistgodkännande krävs.</strong>{" "}
          Inga korrigeringar utförs utan uttryckligt beslut per rad nedan.
          Kataloghub ändrar inte din katalog.
        </p>
      </div>
    </>
  );
}
