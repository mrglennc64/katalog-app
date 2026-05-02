export default function CheckEmailPage() {
  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="mx-auto max-w-sm rounded-lg border border-border bg-bg p-6 shadow-sm">
        <h1 className="mb-1 text-3xl font-bold uppercase text-text">Kolla din inkorg</h1>
        <p className="text-sm text-text">
          Vi har skickat en inloggningslänk till din e-postadress.
          Länken är giltig i 24 timmar.
        </p>
        <p className="mt-3 text-xs text-text-muted">
          Hittar du den inte? Kontrollera skräpposten.
        </p>
      </div>
    </main>
  );
}
