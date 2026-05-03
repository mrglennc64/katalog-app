import Link from "next/link";
import { signIn } from "@/lib/auth";
import { LoginButton } from "./LoginButton";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";

async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
  if (!email.includes("@")) return;
  await signIn("nodemailer", {
    email,
    redirectTo: `${APP_BASE_PATH}/kataloghub`,
  });
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="mx-auto max-w-md rounded-lg border border-border bg-bg p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-text">Logga in med BankID</h1>
        <p className="mb-5 text-xs text-text-muted">
          Filbaserad validering · Ingen systemåtkomst · Ingen integration
        </p>

        <button
          type="button"
          disabled
          className="mb-2 w-full cursor-not-allowed rounded-full bg-kh-orange/40 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Starta BankID-inloggning
        </button>
        <p className="mb-6 text-[11px] text-text-muted">
          BankID-inloggning kommer snart. Använd e-postlänk tillsvidare.
        </p>

        <div className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-wide text-text-muted">
          <span className="h-px flex-1 bg-border" />
          <span>Inloggning via e-post</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form action={loginAction} className="space-y-3">
          <label className="block text-sm">
            <span className="block text-xs uppercase tracking-wide text-text-muted">
              E-post
            </span>
            <input
              name="email"
              className="mt-1 w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text outline-none focus:border-text-muted"
              type="email"
              placeholder="namn@exempel.se"
              autoFocus
              required
            />
          </label>

          <LoginButton />
        </form>

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
      </div>
    </main>
  );
}
