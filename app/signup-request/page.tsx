import Link from "next/link";

async function requestAccess(formData: FormData) {
  "use server";
  const orgnr = String(formData.get("orgnr") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  // For now: log on the server. Wire to Resend/SMTP -> support@kataloghub.se in next iteration.
  console.log("[signup-request]", { orgnr, company, name, email, phone, ts: new Date().toISOString() });
}

export default function SignupRequestPage() {
  return (
    <main className="min-h-screen bg-bg p-6">
      <div className="mx-auto max-w-lg rounded-lg border border-border bg-bg p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-text">
          Begär åtkomst till Kataloghub
        </h1>
        <p className="mb-5 text-sm text-text-muted">
          Fyll i dina uppgifter så kontaktar vi dig. Endast verifierade
          publicister får åtkomst.
        </p>

        <form action={requestAccess} className="space-y-4">
          <Field name="orgnr" label="Organisationsnummer" required placeholder="556123-4567" />
          <Field name="company" label="Företagsnamn" required />
          <Field name="name" label="Namn" required />
          <Field name="email" label="E-post" type="email" required />
          <Field name="phone" label="Telefon (valfritt)" type="tel" />

          <button
            type="submit"
            className="w-full rounded-full bg-kh-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-kh-orange-dark"
          >
            Skicka begäran
          </button>
        </form>

        <p className="mt-6 text-xs text-text-muted">
          Eller mejla direkt:{" "}
          <a
            href="mailto:support@kataloghub.se"
            className="text-kh-orange-dark underline hover:text-kh-orange"
          >
            support@kataloghub.se
          </a>
        </p>

        <p className="mt-4 text-sm">
          <Link href="/login" className="text-text-muted hover:text-text">
            ← Tillbaka till inloggning
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="block text-xs uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-text-muted"
      />
    </label>
  );
}
