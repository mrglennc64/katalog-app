import { Card } from "@/app/components/Card";
import { ValidationVsCorrection } from "@/app/components/ValidationVsCorrection";

export default function AboutPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Validering &amp; Korrigering</h1>
        <p className="mt-1 text-sm text-text-muted">
          Två tjänster, separata steg, publicisten styr överlämningen.
        </p>
      </header>

      <section className="mb-6">
        <ValidationVsCorrection />
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="Validering · Kataloghub">
          <p className="text-sm text-text">
            Automatiserad, filbaserad skanning. Identifierar avvikelser utan
            att ändra data.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-text-muted">
            <li>· CSV-fil in</li>
            <li>· PDF-rapport och CSV-underlag ut</li>
            <li>· Ingen integration, ingen automatisering, ingen systemåtkomst</li>
            <li>· Månadslicens</li>
          </ul>
        </Card>
        <Card title="Korrigering · HeyRoya">
          <p className="text-sm text-text">
            Manuell, verifierad korrigering per verk. Publicistgodkännande
            krävs för varje rad.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-text-muted">
            <li>· Originalkatalog + ifyllt arbetsblad in</li>
            <li>· Korrigerad katalog och CWR-redo fil ut</li>
            <li>· Per-verk-prissättning</li>
            <li>· Publicisten styr varje steg</li>
          </ul>
        </Card>
      </section>

      <section>
        <Card title="Zero-trust">
          <p className="text-sm text-text">
            Inga automatiska ändringar. Allt är filbaserat. Publicisten styr
            varje steg.
          </p>
        </Card>
      </section>
    </>
  );
}
