"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/Card";
import { apiFetch } from "@/lib/api";

export default function NewCatalogPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function create() {
    setErrorMsg(null);
    if (!name.trim()) {
      setErrorMsg("Ange ett katalognamn.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/kataloghub/catalogs", {
        method: "POST",
        body: JSON.stringify({ name: name.trim() }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrorMsg(j.error || `HTTP ${res.status}`);
        return;
      }
      router.push("/kataloghub/catalogs");
    } catch (err) {
      setErrorMsg(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold uppercase">Ny katalog</h1>
        <p className="mt-1 text-sm text-text-muted">
          Skapa en katalog innan du laddar upp metadata.
        </p>
      </header>

      <Card title="Katalogdetaljer">
        <label className="block text-sm">
          <span className="block text-xs uppercase tracking-wide text-text-muted">
            Katalognamn
          </span>
          <input
            className="mt-1 w-full rounded border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-text-muted"
            placeholder="T.ex. Mitt förlag Q3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </label>

        {errorMsg && (
          <p className="mt-3 rounded border border-kh-red/40 bg-kh-red/5 px-3 py-2 text-sm text-kh-red">
            {errorMsg}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={create}
            disabled={submitting || !name.trim()}
            className="rounded-full bg-kh-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kh-orange-dark disabled:cursor-not-allowed disabled:bg-border"
          >
            {submitting ? "Skapar…" : "Skapa katalog"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/kataloghub/catalogs")}
            className="rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
          >
            Avbryt
          </button>
        </div>
      </Card>
    </>
  );
}
