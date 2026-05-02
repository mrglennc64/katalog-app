import Link from "next/link";
import { Card } from "./Card";

export function ExportSection({ catalogId }: { catalogId: string }) {
  return (
    <Card title="Exports">
      <p className="mb-3 text-sm text-text-muted">
        Downloadable artifacts for this catalog. The CWR file becomes
        available after HeyRoya confirms all corrections.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/api/catalogs/${catalogId}/worksheet`}
          className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
        >
          Download corrected worksheet (CSV)
        </Link>
        <Link
          href={`/api/catalogs/${catalogId}/cca`}
          className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
        >
          Download CCA certificate
        </Link>
        <Link
          href={`/api/catalogs/${catalogId}/cwr`}
          className="rounded bg-kh-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kh-orange-dark"
        >
          Download CWR export (.v21)
        </Link>
      </div>
    </Card>
  );
}
