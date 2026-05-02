import { Card } from "@/app/components/Card";

export default function WorksheetsPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Worksheets</h1>
        <p className="mt-1 text-sm text-text-muted">
          Generated correction worksheets. Send to HeyRoya for confirmation.
        </p>
      </header>

      <Card title="Pending">
        <p className="text-sm text-text-muted">
          Stub. Replace with worksheet rows once /api/catalogs/:id/worksheet is
          wired.
        </p>
      </Card>
    </>
  );
}
