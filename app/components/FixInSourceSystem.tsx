import { Card } from "./Card";

export function FixInSourceSystem() {
  return (
    <Card title="Fix in your source system">
      <p className="mb-2 text-sm text-text-muted">
        These fields must be corrected in the publisher&apos;s own system.
        Kataloghub will not touch them.
      </p>
      <ul className="list-disc pl-5 text-sm text-text">
        <li>Ownership</li>
        <li>PRO registrations</li>
        <li>Contractual splits</li>
        <li>Legal rights data</li>
      </ul>
    </Card>
  );
}
