"use client";

import { useState } from "react";

const APP_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function LoginForm() {
  const [orgNumber, setOrgNumber] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ delivered: boolean; devLink?: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSent(null);
    if (!orgNumber.trim()) return setError("Ange organisationsnummer.");
    if (!email.includes("@")) return setError("Ange en giltig e-postadress.");
    setSubmitting(true);
    try {
      const res = await fetch(`${APP_BASE_PATH}/api/auth/email/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_number: orgNumber.trim(), email: email.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || `HTTP ${res.status}`);
        return;
      }
      setSent({ delivered: !!json.delivered, devLink: json.dev_link });
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded border border-kh-green/40 bg-kh-green/5 px-3 py-3 text-sm text-text">
        <p className="font-semibold text-kh-green">
          {sent.delivered
            ? "Inloggningslänk skickad till din e-post."
            : "Inloggningslänk genererad."}
        </p>
        <p className="mt-1 text-text-muted">Länken är giltig i 15 minuter.</p>
        {sent.devLink && (
          <div className="mt-3 rounded border border-border bg-surface p-2 text-[12px]">
            <p className="text-text-muted">Dev-länk (e-post ej levererad):</p>
            <a
              href={sent.devLink}
              className="break-all font-mono text-kh-orange-dark underline"
            >
              {sent.devLink}
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">
        <span className="block text-xs uppercase tracking-wide text-text-muted">
          Organisationsnummer
        </span>
        <input
          className="mt-1 w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text outline-none focus:border-text-muted"
          placeholder="556123-4567"
          value={orgNumber}
          onChange={(e) => setOrgNumber(e.target.value)}
          autoFocus
          required
        />
      </label>
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
          required
        />
      </label>

      {error && (
        <p className="rounded border border-kh-red/40 bg-kh-red/5 px-3 py-2 text-sm text-kh-red">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-kh-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kh-orange-dark disabled:cursor-not-allowed disabled:bg-border"
      >
        {submitting ? "Skickar…" : "Skicka magisk länk"}
      </button>
    </form>
  );
}
