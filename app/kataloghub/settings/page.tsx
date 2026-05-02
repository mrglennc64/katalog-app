import { Card } from "@/app/components/Card";

export default function SettingsPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">
          Tier, contact, and billing configuration.
        </p>
      </header>

      <Card title="Account">
        <p className="text-sm text-text-muted">
          Stub. Wire to /api/account once auth is in place.
        </p>
      </Card>
    </>
  );
}
