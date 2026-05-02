"use client";

import { useFormStatus } from "react-dom";

export function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded bg-kh-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kh-orange-dark disabled:cursor-not-allowed disabled:bg-border"
    >
      {pending ? "Skickar…" : "Skicka inloggningslänk"}
    </button>
  );
}
