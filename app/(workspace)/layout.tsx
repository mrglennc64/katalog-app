import { Sidebar } from "@/app/components/Sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className="flex-1 px-8 py-6"
        style={{ background: "var(--kh-surface)" }}
      >
        {children}
      </main>
    </div>
  );
}
