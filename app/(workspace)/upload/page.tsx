import { Card } from "@/app/components/Card";

export default function UploadPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Upload Catalog</h1>
        <p className="mt-1 text-sm text-text-muted">
          CSV only. No decisions yet — only structure, identifiers, and format.
        </p>
      </header>

      <Card title="Catalog file (CSV)">
        <p className="mb-3 font-mono text-xs text-text-muted">
          Required columns: work_id, title, writer_name, writer_ipi, role_code,
          share, agreement_type, iswc, isrc.
        </p>
        <div className="flex items-center gap-3">
          <label
            htmlFor="catalog"
            className="inline-block cursor-pointer rounded border border-border bg-bg px-4 py-2 text-sm hover:border-text-muted"
          >
            Choose file
          </label>
          <input id="catalog" type="file" accept=".csv" className="hidden" />
          <span className="text-sm text-text-muted">No file selected</span>
          <button
            type="button"
            disabled
            className="ml-auto rounded bg-kh-green px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
          >
            Run scan
          </button>
        </div>
      </Card>
    </>
  );
}
