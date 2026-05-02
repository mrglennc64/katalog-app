"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.includes("@")) {
      setErrorMsg("Ange en giltig e-postadress.");
      return;
    }
    setSubmitting(true);
    try {
      await signIn("nodemailer", { email, callbackUrl: "/kataloghub" });
    } catch (err) {
      setErrorMsg(String(err));
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="mx-auto max-w-sm rounded-lg border border-border bg-bg p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-text">Logga in</h1>
        <p className="mb-4 text-sm text-text-muted">
          Vi skickar en inloggningslänk till din e-post.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm">
            <span className="block text-xs uppercase tracking-wide text-text-muted">
              E-post
            </span>
            <input
              className="mt-1 w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text outline-none focus:border-text-muted"
              type="email"
              placeholder="namn@exempel.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </label>

          {errorMsg && (
            <p className="rounded border border-kh-red/40 bg-kh-red/5 px-3 py-2 text-sm text-kh-red">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !email.includes("@")}
            className="w-full rounded bg-kh-green px-4 py-2 text-sm font-semibold text-white hover:bg-kh-green-dark disabled:cursor-not-allowed disabled:bg-border"
          >
            {submitting ? "Skickar…" : "Skicka inloggningslänk"}
          </button>
        </form>
      </div>
    </main>
  );
}
