import Link from "next/link";

export default function ScanHistoryRedirect() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Skanningshistorik</h1>
      </header>
      <p className="text-sm text-text-muted">
        Den här sidan har flyttats.{" "}
        <Link href="/kataloghub/scans" className="text-kh-green underline hover:text-kh-green-dark">
          Gå till Skanningshistorik →
        </Link>
      </p>
    </>
  );
}
