import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3",
        className
      )}
    >
      {children}
    </p>
  );
}
