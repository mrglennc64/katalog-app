import { Card } from "@/app/components/Card";

export default function ExportsPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Exporter</h1>
        <p className="mt-1 text-sm text-text-muted">
          CWR-redo kataloger efter att HeyRoya bekräftat korrigeringar.
        </p>
      </header>

      <Card title="CWR-redo">
        <p className="text-sm text-text-muted">
          Ingen export skapad ännu.
        </p>
      </Card>
    </>
  );
}
