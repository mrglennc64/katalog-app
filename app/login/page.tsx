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
      <div className="mx-auto max-w-sm rounded-lg border border-border bg-bg p-6 shadow-sm">
        <h1 className="mb-1 text-3xl font-bold uppercase text-text">Logga in</h1>
        <p className="mb-4 text-sm text-text-muted">
          Vi skickar en inloggningslänk till din e-post.
        </p>

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
      </div>
    </main>
  );
}
