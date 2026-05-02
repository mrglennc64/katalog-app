import { Card } from "@/app/components/Card";

export default function ExportsPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Exports</h1>
        <p className="mt-1 text-sm text-text-muted">
          CWR-ready catalogs, after corrections have been confirmed by HeyRoya.
        </p>
      </header>

      <Card title="CWR-ready">
        <p className="text-sm text-text-muted">
          Stub. Wire to HeyRoya correction-summary export endpoint.
        </p>
      </Card>
    </>
  );
}
