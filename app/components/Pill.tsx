type Tone = "green" | "yellow" | "red" | "neutral";

const TONES: Record<Tone, string> = {
  green: "bg-kh-green text-white",
  yellow: "bg-kh-yellow text-black",
  red: "bg-kh-red text-white",
  neutral: "bg-border text-text",
};

export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
