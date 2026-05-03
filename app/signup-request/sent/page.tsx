import Link from "next/link";

export default function SignupSentPage() {
  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="mx-auto max-w-md rounded-lg border border-border bg-bg p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-text">Begäran mottagen</h1>
        <p className="mt-2 text-sm text-text">
          Tack — din begäran är registrerad. Vi kontaktar dig efter manuell
          verifiering av organisationsnumret. Det brukar ta 1–2 arbetsdagar.
        </p>
        <p className="mt-4 text-sm">
          <Link href="/login" className="text-kh-orange-dark underline hover:text-kh-orange">
            Tillbaka till inloggning
          </Link>
        </p>
      </div>
    </main>
  );
}
