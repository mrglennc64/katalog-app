export function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-border bg-bg p-4 ${className}`}
    >
      {title && (
        <h2 className="mb-3 text-base font-semibold text-text">{title}</h2>
      )}
      {children}
    </section>
  );
}
