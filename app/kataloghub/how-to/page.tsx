"use client";

import { Card } from "@/app/components/Card";

export default function HowToPage() {
  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3 print:block">
        <div>
          <h1 className="text-3xl font-bold uppercase">
            Så använder du Kataloghub
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Kataloghub kontrollerar din katalogfil och skapar ett arbetsblad
            med avvikelser. HeyRoya använder samma arbetsblad för att genomföra
            korrigeringar och skapa CWR/CSV/PDF-underlag.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-kh-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kh-orange-dark print:hidden"
        >
          Skriv ut / Spara som PDF
        </button>
      </header>

      <div className="space-y-4 print:space-y-3">
        <Card>
          <Step n={1} title="Ladda upp originalkatalogen">
            <p>
              Gå till <strong>Ladda upp katalog</strong>. Filformat:
              CSV i Kataloghub-schema. Spara originalfilen oförändrad — den
              används som referens i HeyRoya.
            </p>
          </Step>
        </Card>

        <Card>
          <Step n={2} title="Kör skanning">
            <p>
              Starta en ny skanning på den uppladdade katalogen. Kataloghub
              kontrollerar struktur, identifierare och format. Resultatet visas
              som <strong>Scan-resultat</strong> med hälsopoäng och
              kategoriserade avvikelser.
            </p>
          </Step>
        </Card>

        <Card>
          <Step n={3} title="Granska scan-resultat och hälsorapport">
            <ul className="ml-5 list-disc space-y-1">
              <li>
                <strong>Scan-resultat</strong>: översikt över feltyper —
                saknade identifierare, ogiltiga format, dubbletter.
              </li>
              <li>
                <strong>Hälsorapport</strong>: lista per WORK_ID och fält med
                status (OK, INVALID, MISSING).
              </li>
              <li>Använd detta som beslutsunderlag innan du gör ändringar.</li>
            </ul>
          </Step>
        </Card>

        <Card>
          <Step n={4} title="Ladda ner arbetsbladet (CSV)">
            <p>
              Gå till <strong>Arbetsblad</strong> för aktuell skanning. Ladda
              ner arbetsbladet som CSV. Arbetsbladet innehåller följande
              kolumner:
            </p>
            <ul className="mt-2 ml-5 list-disc space-y-0.5 font-mono text-[12.5px]">
              <li>issue_id</li>
              <li>work_id</li>
              <li>field</li>
              <li>original_value</li>
              <li>suggested_value</li>
              <li>decision</li>
              <li>notes</li>
            </ul>
          </Step>
        </Card>

        <Card>
          <Step n={5} title="Fyll i arbetsbladet">
            <p>Öppna CSV i Excel eller liknande. För varje rad:</p>
            <ul className="mt-2 ml-5 list-disc space-y-1">
              <li>
                <strong>decision</strong>:
                <ul className="ml-5 list-disc">
                  <li>
                    <code className="font-mono text-xs">approve</code> — om du
                    accepterar förslaget
                  </li>
                  <li>
                    <code className="font-mono text-xs">reject</code> — om du
                    vill behålla originalvärdet
                  </li>
                  <li>
                    <code className="font-mono text-xs">defer</code> — om du
                    vill åtgärda senare
                  </li>
                </ul>
              </li>
              <li>
                <strong>notes</strong>: valfri kommentar
              </li>
            </ul>
            <p className="mt-3 rounded border border-border bg-surface p-3 text-[13px]">
              Spara filen som CSV (kommaavgränsad). Ändra inte kolumnnamn eller
              ordning.
            </p>
          </Step>
        </Card>

        <Card>
          <Step n={6} title="Skicka arbetsbladet till HeyRoya">
            <ol className="ml-5 list-decimal space-y-1">
              <li>
                Gå till{" "}
                <a
                  href="https://upload.heyroya.se"
                  className="text-kh-orange-dark underline hover:text-kh-orange"
                >
                  upload.heyroya.se
                </a>
                .
              </li>
              <li>Ange organisationsnummer.</li>
              <li>
                Ladda upp:
                <ul className="ml-5 list-disc">
                  <li>originalkatalogen (från steg 1)</li>
                  <li>det ifyllda arbetsbladet (från steg 5)</li>
                </ul>
              </li>
              <li>
                HeyRoya skapar ett arbetsblad i din dashboard med alla beslut.
              </li>
            </ol>
          </Step>
        </Card>

        <Card>
          <Step n={7} title="Godkänn i HeyRoya och ladda ner underlag">
            <ol className="ml-5 list-decimal space-y-1">
              <li>Logga in i HeyRoya.</li>
              <li>Öppna det nya arbetsbladet.</li>
              <li>Bekräfta eller justera beslut per rad.</li>
              <li>
                När allt är klart kan du ladda ner:
                <ul className="ml-5 list-disc">
                  <li>korrigerad CSV</li>
                  <li>CWR-fil</li>
                  <li>PDF-rapport</li>
                </ul>
              </li>
            </ol>
          </Step>
        </Card>
      </div>

      <footer className="mt-8 hidden border-t border-border pt-4 text-center text-[11px] text-text-muted print:block">
        Kataloghub · Filbaserad validering · Ingen systemåtkomst · Ingen automatisering
      </footer>

      <style jsx global>{`
        @media print {
          aside { display: none !important; }
          main { padding: 0 !important; max-width: none !important; }
          body { background: #fff !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-kh-orange bg-kh-orange/10 text-sm font-bold text-kh-orange-dark">
        {n}
      </span>
      <div className="flex-1 text-sm text-text">
        <h2 className="mb-2 text-base font-semibold text-text">{title}</h2>
        <div className="space-y-1.5 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
