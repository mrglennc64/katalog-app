import Link from "next/link";
import { LoginForm } from "./LoginForm";

type SearchParams = { err?: string };

const ERROR_MESSAGES: Record<string, string> = {
  missing_token: "Inloggningslänk saknas.",
  invalid_token: "Inloggningslänken är ogiltig eller har gått ut. Begär en ny.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const errMsg = params.err ? ERROR_MESSAGES[params.err] : null;

  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="mx-auto max-w-md rounded-lg border border-border bg-bg p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-text">Logga in</h1>
        <p className="mb-5 text-xs text-text-muted">
          Filbaserad validering · Ingen systemåtkomst · Ingen integration
        </p>

        {errMsg && (
          <p className="mb-4 rounded border border-kh-red/40 bg-kh-red/5 px-3 py-2 text-sm text-kh-red">
            {errMsg}
          </p>
        )}

        <LoginForm />

        <p className="mt-3 text-[11px] text-text-muted">
          Vi skickar en inloggningslänk till din e-post. Endast godkända
          publicister kan logga in.
        </p>

        <hr className="my-6 border-border" />

        <p className="text-sm text-text">Har du inget konto?</p>
        <p className="mt-1 text-sm text-text-muted">
          Endast verifierade publicister får åtkomst.{" "}
          <Link
            href="/signup-request"
            className="text-kh-orange-dark underline hover:text-kh-orange"
          >
            Begär åtkomst
          </Link>{" "}
          eller mejla{" "}
          <a
            href="mailto:support@kataloghub.se"
            className="text-kh-orange-dark underline hover:text-kh-orange"
          >
            support@kataloghub.se
          </a>
          .
        </p>

        <p className="mt-4 text-[11px] text-text-muted">
          BankID-inloggning planeras i kommande fas.
        </p>
      </div>
    </main>
  );
}
