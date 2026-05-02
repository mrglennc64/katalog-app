export type Severity = "clean" | "resolvable" | "blocking" | string;

export function severityClass(status: Severity): string {
  switch (status) {
    case "clean":
      return "inline-block rounded-full border border-kh-green/40 bg-kh-green/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-kh-green";
    case "resolvable":
      return "inline-block rounded-full border border-kh-yellow/40 bg-kh-yellow/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#7a5a10]";
    case "blocking":
      return "inline-block rounded-full border border-kh-red/40 bg-kh-red/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-kh-red";
    default:
      return "inline-block rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] font-semibold uppercase text-text-muted";
  }
}

export function severityLabel(status: Severity): string {
  switch (status) {
    case "clean":
      return "OK";
    case "resolvable":
      return "Åtgärdbar";
    case "blocking":
      return "Blockerande";
    default:
      return status;
  }
}
