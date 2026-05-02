"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/Card";
import { apiFetch } from "@/lib/api";

export default function TransferCatalogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function transfer() {
    setErrorMsg(null);
    if (!email.includes("@")) {
      setErrorMsg("Ange en giltig e-postadress.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/kataloghub/catalogs/${id}/transfer`, {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrorMsg(j.error || `HTTP ${res.status}`);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/kataloghub/catalogs"), 1500);
    } catch (err) {
      setErrorMsg(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Överför ägarskap</h1>
        <p className="mt-1 font-mono text-xs text-text-muted">{id}</p>
      </header>

      <Card title="Ny ägare">
        <p className="mb-3 text-sm text-text">
          Den nya ägaren får full kontroll över katalogen och alla dess skanningar.
        </p>
        <label className="block text-sm">
          <span className="block text-xs uppercase tracking-wide text-text-muted">
            E-post
          </span>
          <input
            className="mt-1 w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text outline-none focus:border-text-muted"
            type="email"
            placeholder="ny.agare@exempel.se"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {errorMsg && (
          <p className="mt-3 rounded border border-kh-red/40 bg-kh-red/5 px-3 py-2 text-sm text-kh-red">
            {errorMsg}
          </p>
        )}
        {success && (
          <p className="mt-3 rounded border border-kh-green/40 bg-kh-green/5 px-3 py-2 text-sm text-kh-green">
            Överföring inskickad. Återställer…
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={transfer}
            disabled={submitting || !email.includes("@")}
            className="rounded bg-kh-green px-4 py-2 text-sm font-semibold text-white hover:bg-kh-green-dark disabled:cursor-not-allowed disabled:bg-border"
          >
            {submitting ? "Överför…" : "Överför"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/kataloghub/catalogs/${id}`)}
            className="rounded border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
          >
            Avbryt
          </button>
        </div>
      </Card>
    </>
  );
}
