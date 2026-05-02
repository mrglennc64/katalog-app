const GUIDANCE: Record<string, string> = {
  identifiers: "Lägg till ISWC, ISRC eller Work ID i ditt källsystem.",
  splits: "Kontrollera att alla andelar summerar till 100 %.",
  roles: "Verifiera att varje upphovsperson har korrekt rollkod.",
  duplicates: "Ta bort eller slå ihop dubbla verk i ditt källsystem.",
  conflicts: "Lös motstridiga uppgifter i ditt källsystem innan export.",
};

export function KataloghubFixGuidance({ category }: { category: string }) {
  const text =
    GUIDANCE[category] ?? "Åtgärda detta i ditt källsystem innan nästa skanning.";
  return (
    <div className="rounded-md border border-border bg-bg p-3 text-sm text-text">
      <strong className="block text-xs uppercase tracking-wide text-kh-green">
        Hur du åtgärdar detta
      </strong>
      <p className="mt-1">{text}</p>
    </div>
  );
}
