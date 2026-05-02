"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/Card";
import { apiFetch } from "@/lib/api";

export default function EditCatalogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(`/api/kataloghub/catalogs/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setName(d.name || "");
        setLoaded(true);
      })
      .catch((err) => {
        setErrorMsg(String(err));
        setLoaded(true);
      });
  }, [id]);

  async function save() {
    setErrorMsg(null);
    if (!name.trim()) {
      setErrorMsg("Ange ett katalognamn.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/kataloghub/catalogs/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: name.trim() }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrorMsg(j.error || `HTTP ${res.status}`);
        return;
      }
      router.push(`/kataloghub/catalogs/${id}`);
    } catch (err) {
      setErrorMsg(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function remove() {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/kataloghub/catalogs/${id}`, { method: "DELETE" });
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

  if (!loaded) return <p className="text-sm text-text-muted">Laddar…</p>;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Redigera katalog</h1>
        <p className="mt-1 font-mono text-xs text-text-muted">{id}</p>
      </header>

      <Card title="Katalognamn">
        <label className="block text-sm">
          <span className="block text-xs uppercase tracking-wide text-text-muted">
            Namn
          </span>
          <input
            className="mt-1 w-full rounded border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-text-muted"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            onClick={save}
            disabled={submitting}
            className="rounded-full bg-kh-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kh-orange-dark disabled:cursor-not-allowed disabled:bg-border"
          >
            {submitting ? "Sparar…" : "Spara"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/kataloghub/catalogs/${id}`)}
            className="rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
          >
            Avbryt
          </button>
        </div>
      </Card>

      <Card title="Farligt område" className="mt-4">
        <p className="mb-3 text-sm text-text">
          Att ta bort katalogen raderar alla skanningar och underlag permanent.
        </p>
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded border border-kh-red/40 bg-kh-red/10 px-4 py-2 text-sm font-semibold text-kh-red hover:bg-kh-red/20"
          >
            Ta bort katalog
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-kh-red">
              Är du säker? Detta går inte att ångra.
            </span>
            <button
              type="button"
              onClick={remove}
              disabled={submitting}
              className="rounded-full bg-kh-red px-4 py-2 text-sm font-semibold text-white hover:bg-kh-red/80 disabled:cursor-not-allowed"
            >
              {submitting ? "Tar bort…" : "Ja, ta bort"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-text-muted"
            >
              Avbryt
            </button>
          </div>
        )}
      </Card>
    </>
  );
}
