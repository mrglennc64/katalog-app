type Step = { label: string; href?: string };

export function StepIndicator({
  steps,
  current,
}: {
  steps: Step[];
  current: number;
}) {
  return (
    <nav className="mb-6 -mx-4 overflow-x-auto px-4">
      <ol className="flex min-w-max items-center gap-0">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const status =
            stepNum < current ? "done" : stepNum === current ? "active" : "upcoming";
          const isLast = idx === steps.length - 1;
          return (
            <li key={step.label} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    status === "upcoming"
                      ? "bg-border text-text-muted"
                      : "bg-kh-green text-white"
                  }`}
                >
                  {stepNum}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    status === "upcoming" ? "text-text-muted" : "text-text"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`mx-2 mt-[-14px] h-px w-12 ${
                    status === "done" ? "bg-kh-green" : "bg-border"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export const PIPELINE_STEPS: Step[] = [
  { label: "Ladda upp" },
  { label: "Skanning" },
  { label: "Hälsorapport" },
  { label: "Arbetsblad" },
  { label: "HeyRoya" },
];
