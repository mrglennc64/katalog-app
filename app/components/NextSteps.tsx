import { Card } from "./Card";

const DEFAULT_STEPS = [
  "Review the worksheet issues.",
  "Confirm or reject suggested corrections.",
  "Return the completed worksheet to HeyRoya.",
  "Receive CWR-ready catalog export.",
];

export function NextSteps({
  title = "Next steps",
  steps = DEFAULT_STEPS,
}: {
  title?: string;
  steps?: string[];
}) {
  return (
    <Card title={title}>
      <ol className="list-decimal pl-5 text-sm text-text">
        {steps.map((s, i) => (
          <li key={i} className="py-0.5">
            {s}
          </li>
        ))}
      </ol>
    </Card>
  );
}
